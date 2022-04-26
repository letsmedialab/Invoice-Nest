import { Col, PageHeader, Row } from 'antd'
import type { NextPage } from 'next'
import React, { } from 'react'
import CreateInvoice from '../../component/Invoice/CreateInvoice'

const InvoicePage: NextPage = () => {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Invoice"
        subTitle="Add New Invoice"
      />
      <CreateInvoice></CreateInvoice>
    </div>
  )
}

export default InvoicePage