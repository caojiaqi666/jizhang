import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { query } from '@/utils/mysql/client'
import type { RowDataPacket } from 'mysql2/promise'

async function getRecentTransactions() {
  const transactions = await query<RowDataPacket>(
    `SELECT 
      t.id,
      t.amount,
      t.date,
      t.note,
      u.phone,
      u.display_name,
      c.name as category_name,
      l.name as ledger_name
    FROM transactions t
    LEFT JOIN users u ON t.user_id = u.id
    LEFT JOIN categories c ON t.category_id = c.id
    LEFT JOIN ledgers l ON t.ledger_id = l.id
    ORDER BY t.date DESC
    LIMIT 100`
  )
  
  return transactions
}

export default async function TransactionsPage() {
  const transactions = await getRecentTransactions()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">交易记录</h1>
        <p className="text-gray-600 mt-2">查看最近的交易记录（最多100条）</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>最近交易</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-3 font-medium text-gray-600">用户</th>
                  <th className="pb-3 font-medium text-gray-600">金额</th>
                  <th className="pb-3 font-medium text-gray-600">分类</th>
                  <th className="pb-3 font-medium text-gray-600">账本</th>
                  <th className="pb-3 font-medium text-gray-600">备注</th>
                  <th className="pb-3 font-medium text-gray-600">时间</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t: any) => {
                  const amount = Number(t.amount)
                  const isIncome = amount > 0
                  
                  return (
                    <tr key={t.id} className="border-b last:border-0">
                      <td className="py-4">
                        <div>
                          <p className="font-medium">{t.display_name}</p>
                          <p className="text-sm text-gray-500">{t.phone}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`font-mono font-semibold ${
                          isIncome ? 'text-emerald-600' : 'text-gray-800'
                        }`}>
                          {isIncome ? '+' : ''}{amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4">{t.category_name || '-'}</td>
                      <td className="py-4">{t.ledger_name || '-'}</td>
                      <td className="py-4 text-sm text-gray-600">{t.note || '-'}</td>
                      <td className="py-4 text-sm text-gray-600">
                        {new Date(t.date).toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

