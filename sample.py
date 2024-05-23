#入力
n, m = map(int, input().split())
a = list(map(int, input().split()))

#m点以上をカウントするための変数
ans = 0

#点数を一つずつ見ていく。
for i in range(n):
    #m点以上ならカウントする
    if a[i] >= m:
        ans += 1

#出力
print(ans)