def max_valid_segment_length(arr, K):
    n = len(arr)
    best = 0

    for l in range(n):
        for r in range(l, n):
            total = 0
            buffer = 0
            prev = None
            polarity = 1
            flips = K

            valid = True

            for i in range(l, r + 1):
                if prev is None:
                    buffer += arr[i]
                else:
                    # add to buffer
                    buffer += arr[i]

                    # check flush condition
                    if arr[i] > arr[i - 1]:
                        total += polarity * buffer
                        buffer = 0

                        # invalid check
                        if total < 0:
                            # try using flip if available
                            if flips > 0:
                                flips -= 1
                                polarity *= -1
                                # re-apply last flush under new polarity
                                # (undo previous addition effect)
                                total += 2 * (-polarity) * buffer  # safe correction attempt
                            else:
                                valid = False
                                break

                prev = arr[i]

                if total < 0:
                    valid = False
                    break

            if valid:
                best = max(best, r - l + 1)

    return best


# ---- Driver Code ----
if __name__ == "__main__":
    n, k = map(int, input().split())
    arr = list(map(int, input().split()))
    print(max_valid_segment_length(arr, k))