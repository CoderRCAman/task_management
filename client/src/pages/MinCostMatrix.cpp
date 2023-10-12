#include <iostream>
#include <algorithm>
using namespace std;
int dp[21][21];
int findMinCost(int mat[20][20], int row, int col)
{
    int curValue = mat[row][col];
    if (dp[row][col] != 0)
        return dp[row][col];
    int byTop = row - 1 >= 0 ? findMinCost(mat, row - 1, col) + curValue : INT8_MAX;
    int byLeft = col - 1 >= 0 ? findMinCost(mat, row, col - 1) + curValue : INT8_MAX;
    int byDiag = row - 1 >= 0 && col - 1 >= 0 ? findMinCost(mat, row - 1, col - 1) + curValue : INT8_MAX;
    if (byTop == INT8_MAX && byLeft == INT8_MAX && byDiag == INT8_MAX)
    {
        dp[row][col] = curValue;
        return dp[row][col];
    }
    dp[row][col] = min(byTop, min(byLeft, byDiag));
    return dp[row][col]; 
}


int main()
{
    int row, col, mat[20][20]; // 
    cout << "Enter the number of rows :";
    cin >> row;
    cout << "Enter the number of column:";
    cin >> col;
    cout << "Enter elements in the matrix: ";
    for (int i = 0; i < row; ++i)
        for (int j = 0; j < col; ++j)
            cin >> mat[i][j];
    cout << "Minmum cost is: " << findMinCost(mat, row - 1, col - 1);
    return 0;
}
