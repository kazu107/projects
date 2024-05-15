import math
from itertools import permutations
#入力
n = int(input())
#座標を格納
vec = []
for i in range(n):
    x, y = map(float, input().split())
    vec.append([x, y])
#最短距離を無限大に初期化
min_distance = float('inf')
#都市2から都市nまでの順列を全探索
for perm in permutations(vec[1:]):
    #現在の順列を作成
    cur = [vec[0]] + list(perm)
    #距離を初期化
    dist = 0
    # 隣接する点間の距離を計算
    for i in range(n - 1):
        dist += math.sqrt((cur[i][0] - cur[i + 1][0]) ** 2 + (cur[i][1] - cur[i + 1][1]) ** 2)
    # ループを閉じるため最後の点から最初の点への距離を加える
    dist += math.sqrt((cur[n - 1][0] - cur[0][0]) ** 2 + (cur[n - 1][1] - cur[0][1]) ** 2)
    # 最小距離を更新
    if dist < min_distance:
        min_distance = dist
# 結果を出力
print("{:.15f}".format(min_distance))