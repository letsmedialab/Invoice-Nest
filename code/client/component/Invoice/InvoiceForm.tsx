import { Form, Input, Button, Checkbox, Select, DatePicker, Space, Table, Col, Row, Divider, InputNumber, Typography, Modal, Alert } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useState } from 'react';
import CustomerForm from '../Customer/CustomerForm';
import { useRouter } from 'next/router';
import axios from 'axios';
import Loader from '../Loader/Loader';
import moment from 'moment';
import TaxForm from '../Tax/TaxForm';
const { Option } = Select;

export default function InvoiceForm({ props }: any) {

  const [isCustomerModalVisible, setCustomerModalVisible] = useState(false);
  const [isTaxModalVisible, setTaxModalVisible] = useState(false);
  const router = useRouter();
  const action = router.query?.action;
  const invoiceId = router.query?.id;
  const [isLoading, setLoader] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isError, setError] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      if (action === 'edit') {
        try {
          setLoader(true);
          const result = await axios.get(process.env.API_PATH + '/invoices/' + invoiceId);
          form.setFieldsValue(result.data);
        } catch (err) {
          console.error(err);
          setError(true);
        } finally {
          setLoader(false);
        }
      } else {
        form.setFieldsValue({
          invoiceNumber: 'INV' + props.invoiceNumber.padStart(8, '0'),
          invoiceDate: moment(),
          invoices: [{}],
        });
      }
    })();
  }, [action, form, invoiceId, props.invoiceNumber]);

  const handleCustomerModelOk = () => {
    setCustomerModalVisible(false);
  };

  const handleCustomerModelCancel = () => {
    setCustomerModalVisible(false);
  };

  const showCustomerModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCustomerModalVisible(true);
  };

  const handleTaxModelOk = () => {
    setTaxModalVisible(false);
  };

  const handleTaxModelCancel = () => {
    setTaxModalVisible(false);
  };

  const showTaxModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setTaxModalVisible(true);
  };

  const existingCustomers = [];
  const existingItems = [];
  const existingTaxes = [];

  for (let customer of props?.customers) {
    existingCustomers.push(<Option key={customer.customerId}>{customer.firstName + ' ' + customer.lastName}</Option>);
  }

  for (let item of props?.items) {
    existingItems.push(<Option key={item.itemId}>{item.name}</Option>);
  }

  for (let tax of props?.taxes) {
    existingTaxes.push(<Option key={tax.taxId}>{tax.name}</Option>);
  }

  const onValuesChange = async (changedValues: any, allValues: any) => {

    allValues.subTotal = 0;
    allValues.total = 0;
    console.log(allValues);

    allValues?.invoices?.forEach((v: any, i: number) => {
      // console.log(v, i)
      if (allValues.invoices[i]) {
        allValues.invoices[i].total = (v?.quantity * v?.price) || 0;
        allValues.subTotal += allValues.invoices[i].total;
      }

      allValues.total = allValues.subTotal + allValues.tax + allValues.shipping + allValues.adjustment - allValues.discount;
      form.setFieldsValue(allValues)

    })
  }

  const onFinish = async (values: any) => {

    try {
      if (action === 'edit') {
        await axios.patch(process.env.API_PATH + '/invoices/' + invoiceId, { ...values, userId: 6 });
      } else {
        console.log(values);
        await axios.post(process.env.API_PATH + '/invoices', { ...values, userId: 6 });
      }
      router.push('/invoices');
      setSuccess(true);
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoader(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'name',
      render: (text: string) => <a>{text}</a>,
      width: '22%'
    },
    {
      title: 'Item Description',
      className: 'description',
      dataIndex: 'description',
      // align: 'right',
      width: '48%'
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: '10%'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      width: '10%'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '10%'
    },
  ];

  const data = [{
    name: <Form.Item> <Input /> </Form.Item>,
    description: <Form.Item> <TextArea autoSize /> </Form.Item>,
    quantity: <Form.Item> <Input /> </Form.Item>,
    price: <Form.Item> <Input /> </Form.Item>,
    amount: <Form.Item> <Input /> </Form.Item>,
  }];

  const discountSuffixSelector = (
    <Form.Item name="suffix" noStyle>
      <Select style={{ width: 70 }} defaultValue="percent">
        <Option value="percent">%</Option>
        <Option value="abs">₹</Option>
      </Select>
    </Form.Item>
  );

  return (
    <>
      <Modal title="Add Customer" visible={isCustomerModalVisible} onOk={handleCustomerModelOk} onCancel={handleCustomerModelCancel}>
        <CustomerForm />
      </Modal>

      <Modal title="Add Tax" visible={isTaxModalVisible} onOk={handleTaxModelOk} onCancel={handleTaxModelCancel}>
        <TaxForm />
      </Modal>

      {
        isSuccess && <Alert message="New item added successfully!" type="success" closable showIcon className='p-4' />
      }
      {
        isError && <Alert message="Unable to add/update the new item, please try again!" type="error" closable showIcon className='p-4' />
      }
      {
        isLoading && <Loader />
      }
      {
        !isLoading &&
        <Form
          form={form}
          layout='horizontal'
          name="basic"
          // labelCol={{ sm: { span: 8 }, lg: { span: 4 } }}
          // wrapperCol={{ sm: { span: 12 }, lg: { span: 8 } }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
          autoComplete="off"
          preserve={true}
        >

          <Form.Item label="Customer Name" name="customerName">
            <Select
              showSearch
              placeholder="Select a Customer"
              optionFilterProp="children"
              // onChange={onChange}
              // onSearch={onSearch}
              filterOption={(input, option) =>
                (option?.children + '').toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              dropdownRender={(menu: any) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space align="center" style={{ padding: '0 8px 4px' }}>
                    <Typography.Link onMouseDown={e => e.preventDefault()} onClick={showCustomerModal}>
                      <PlusOutlined /> Add item
                    </Typography.Link>
                  </Space>
                </>
              )}
            >
              {existingCustomers}
            </Select>
          </Form.Item>

          <Form.Item label="Invoice Number" name="invoiceNumber">
            <Input />
          </Form.Item>

          <Form.Item label="Order Number" name="orderNumber">
            <Input />
          </Form.Item>

          <Form.Item label="Invoice Date" name="invoiceDate">
            <DatePicker />
          </Form.Item>

          <Form.Item label="Due Date" name="dueDate">
            <DatePicker />
          </Form.Item>

          {/* <Form.Item label="Sales Person Name" name="layout">
          <Select
            showSearch
            placeholder="Select a Sales Person"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children + '').toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Select.Option value="Aravind A">Aravind A</Select.Option>
            <Select.Option value="Varun A">Varun Frontline</Select.Option>
            <Select.Option value="Nisha C">Nisha C</Select.Option>
          </Select>
        </Form.Item> */}

          <Row className='p-4 m-4'>
            <Col xs={24} xl={18}>
              <strong>Invoice Items</strong>
              <Divider></Divider>
              <Form.List name="invoices">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="start" id="invoice_list">
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          rules={[{ required: true, message: 'Missing name' }]}
                        >
                          <Input placeholder="item name" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'description']}
                          rules={[{ required: true, message: 'Missing description' }]}
                        >
                          <TextArea rows={4} placeholder="description" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'quantity']}
                          rules={[{ required: true, message: 'Missing quantity' }]}
                        >
                          <InputNumber min={1} max={999999999} step={1} placeholder="quantity" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'price']}
                          rules={[{ required: true, message: 'Missing price' }]}
                        >
                          <InputNumber min={1} max={999999999} step={0.25} placeholder="price" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'total']}
                        >
                          <InputNumber min={1} max={999999999} step={0.25} placeholder="total" readOnly />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} className='remove_invoice' />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add field
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>
          </Row>

          <Row className='p-4 m-4'>
            <Col sm={{ span: 24 }} lg={{ push: 12, span: 12 }} >
              <Form.Item label="Sub Total" name='subTotal'>
                <InputNumber min={1} max={999999999} step={0.25} placeholder="sub total" />
              </Form.Item>
              <Form.Item label="Tax:" name="taxId">
                <Select
                  showSearch
                  placeholder="Choose Tax"
                  optionFilterProp="children"
                  // onChange={onChange}
                  // onSearch={onSearch}
                  filterOption={(input, option) =>
                    (option?.children + '').toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  dropdownRender={(menu: any) => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <Space align="center" style={{ padding: '0 8px 4px' }}>
                        <Typography.Link onMouseDown={e => e.preventDefault()} onClick={showTaxModal}>
                          <PlusOutlined /> Add item
                        </Typography.Link>
                      </Space>
                    </>
                  )}
                >
                  {existingTaxes}
                </Select>
              </Form.Item>
              <Form.Item label="Tax" name='tax'>
                <InputNumber min={1} max={999999999} step={0.25} placeholder="tax" />
              </Form.Item>
              <Form.Item label="Shipping" name='shipping'>
                <InputNumber min={0} max={999999999} step={0.25} placeholder="shipping" />
              </Form.Item>
              <Form.Item label="Discount" name='discount'>
                <InputNumber min={0} max={999999999} step={0.25} placeholder="discount" addonAfter={discountSuffixSelector} />
              </Form.Item>
              <Form.Item label="Adjustment" name='adjustment'>
                <InputNumber min={-999999999} max={999999999} step={0.25} placeholder="adjustment +/-" />
              </Form.Item>
              <Form.Item label="Total" name='total'>
                <InputNumber min={1} max={999999999} step={0.25} placeholder="total" readOnly />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Terms & Conditions" name="tnc">
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item label="Footer Note" name="footerNote">
            <TextArea rows={2} />
          </Form.Item>

          <Row className='p-4 m-4 gap-4 justify-center'>
            <Button type="primary" size="large">Save</Button>
            <Button size="large">Cancel</Button>
          </Row>
        </Form>
      }
    </>
  )
}
