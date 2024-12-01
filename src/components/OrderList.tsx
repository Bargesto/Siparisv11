import { useState, useEffect } from 'react'
import { Order, Product } from '../types'
import { ChevronUp, ChevronDown } from 'lucide-react'

type SortField = 'orderDate' | 'instagramUsername' | 'productName' | 'size' | 'price'
type SortDirection = 'asc' | 'desc'

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [sortField, setSortField] = useState<SortField>('orderDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  useEffect(() => {
    // Load orders and products from localStorage
    const storedOrders = localStorage.getItem('orders')
    const storedProducts = localStorage.getItem('products')
    
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders)
      setOrders(parsedOrders)
    }
    
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    }
  }, [])

  const getOrderPrice = (productId: string): number => {
    const product = products.find(p => p.id === productId)
    return product?.price || 0
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // If clicking the same field, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // If clicking a new field, set it with desc direction
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const getSortedOrders = () => {
    return [...orders].sort((a, b) => {
      let compareValue: number = 0
      
      switch (sortField) {
        case 'orderDate':
          compareValue = new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          break
        case 'instagramUsername':
          compareValue = a.instagramUsername.localeCompare(b.instagramUsername)
          break
        case 'productName':
          compareValue = a.productName.localeCompare(b.productName)
          break
        case 'size':
          compareValue = a.size.localeCompare(b.size)
          break
        case 'price':
          compareValue = getOrderPrice(a.productId) - getOrderPrice(b.productId)
          break
      }

      return sortDirection === 'asc' ? compareValue : -compareValue
    })
  }

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null

    return sortDirection === 'asc' ? 
      <ChevronUp className="inline h-4 w-4" /> : 
      <ChevronDown className="inline h-4 w-4" />
  }

  const sortedOrders = getSortedOrders()

  if (orders.length === 0) {
    return null
  }

  const renderHeaderCell = (field: SortField, label: string) => (
    <th 
      onClick={() => handleSort(field)}
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
    >
      <div className="flex items-center gap-1">
        {label}
        <SortIndicator field={field} />
      </div>
    </th>
  )

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Son Siparişler</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {renderHeaderCell('orderDate', 'Sipariş Tarihi')}
                {renderHeaderCell('instagramUsername', 'Instagram')}
                {renderHeaderCell('productName', 'Ürün')}
                {renderHeaderCell('size', 'Beden')}
                {renderHeaderCell('price', 'Fiyat')}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    @{order.instagramUsername}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getOrderPrice(order.productId).toLocaleString('tr-TR')} ₺
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OrderList