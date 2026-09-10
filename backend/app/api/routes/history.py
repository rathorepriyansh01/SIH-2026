from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import ScanHistory
from app.services.advisory_service import AdvisoryService


router = APIRouter()


@router.get("/history", status_code=status.HTTP_200_OK)
def get_scan_history(
    db: Session = Depends(get_db)
):
    """
    Fetch all previous scan records
    sorted by newest first.
    """

    scans = (
        db.query(ScanHistory)
        .order_by(ScanHistory.created_at.desc())
        .all()
    )

    result = []

    for scan in scans:

        result.append({
            "id": scan.id,
            "image_path": scan.image_path,
            "crop": scan.crop,
            "disease": scan.disease,
            "confidence": scan.confidence,
            "risk_level": scan.risk_level,
            "created_at": (
                scan.created_at.isoformat() + "Z"
                if scan.created_at
                else None
            )
        })

    return {
        "success": True,
        "count": len(result),
        "history": result
    }


@router.get(
    "/history/{scan_id}",
    status_code=status.HTTP_200_OK
)
def get_scan_detail(
    scan_id: str,
    db: Session = Depends(get_db)
):
    """
    Fetch complete details of one scan.
    """

    scan = (
        db.query(ScanHistory)
        .filter(ScanHistory.id == scan_id)
        .first()
    )

    if not scan:

        raise HTTPException(
            status_code=404,
            detail=(
                f"Scan record with ID "
                f"'{scan_id}' not found."
            )
        )

    advisory = AdvisoryService.get_advisory(
        scan.disease
    )

    confidence_level = (
        "High"
        if scan.confidence >= 80.0
        else (
            "Moderate"
            if scan.confidence >= 60.0
            else "Low"
        )
    )

    return {

        "success": True,

        "prediction": {

            "crop": scan.crop,

            "disease": scan.disease,

            "confidence": scan.confidence,

            "risk_level": scan.risk_level,

            "confidence_level": confidence_level

        },

        "disease_information": {

            "description": advisory.get(
                "description",
                ""
            ),

            "symptoms": advisory.get(
                "symptoms",
                []
            ),

            "possible_causes": advisory.get(
                "possible_causes",
                []
            )

        },

        "recommended_actions": advisory.get(
            "recommended_actions",
            {
                "immediate_actions": [],
                "prevention": [],
                "when_to_seek_expert_help": ""
            }
        ),

        "scan_metadata": {

            "scan_id": scan.id,

            "timestamp": (
                scan.created_at.isoformat() + "Z"
                if scan.created_at
                else None
            ),

            "image_path": scan.image_path

        }

    }