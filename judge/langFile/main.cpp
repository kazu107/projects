// hello.cpp
#include <bits/stdc++.h>
using namespace std;

int main(int argc, char* argv[]) {
    int n, m; cin >> n >> m;
    int ans = 0;
    for (int i = 0; i < n; i ++) {
        int x; cin >> x;
        ans += x;
    }
    if (m <= ans) {
        cout << "Yes" << endl;
    }
    else {
        cout << "No" << endl;
    }
}
