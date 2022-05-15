import { Col, PageHeader, Row } from 'antd'
import type { NextPage } from 'next'
import React, { } from 'react'
import CustomerForm from '../../component/Customer/CustomerForm'

const CustomerPage: NextPage = () => {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Customer"
        subTitle="Add New"
      />

      <CustomerForm></CustomerForm>
    </div>
  )
}

export default CustomerPage
