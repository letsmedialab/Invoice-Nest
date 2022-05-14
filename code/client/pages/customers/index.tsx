import { Col, PageHeader, Row } from 'antd'
import type { NextPage } from 'next'
import React, { } from 'react'
import ListCustomer from '../../component/Customer/ListCustomer'

const CustomerPage: NextPage = () => {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Customer"
        subTitle="List"
      />

      <ListCustomer></ListCustomer>
    </div>
  )
}

export default CustomerPage
