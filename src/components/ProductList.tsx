import { useState, useEffect } from 'react'
import { Product } from '../types'
import ProductCard from './ProductCard'
import OrderList from './OrderList'

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const storedProducts = localStorage.getItem('products')
    if (storedProducts) {
      const allProducts = JSON.parse(storedProducts)
      // Show first 3 products on homepage
      setProducts(allProducts.slice(0, 3))
    }
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Ürünlerimiz</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Orders list section */}
      <OrderList />
    </div>
  )
}

export default ProductList