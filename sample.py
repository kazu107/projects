n = int(input())
s = input()
#setを作る
a = set()
for x in s:
    #aにxをいれる
    a.add(x)
if len(a) == 7:
    print("Yes")
else:
    print("No")