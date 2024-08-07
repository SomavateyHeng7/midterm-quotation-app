import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import QuotationTable from "./QuotationTable";
import productList from './product.json';

function App() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [ppu, setPpu] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [dataItems, setDataItems] = useState([]);

  useEffect(() => {
    const initialProductCode = 'p001'; 
    const initialProduct = productList.find(product => product.code === initialProductCode);

    if (initialProduct) {
      setSelectedProduct(initialProductCode);
      setPpu(initialProduct.price);
      setQuantity(1); 
      setDiscount(50); 
    }
  }, []);

  const addItem = () => {
    const item = productList.find(v => selectedProduct === v.code);

    const existingItemIndex = dataItems.findIndex(
      v => v.item === item.name && v.ppu === ppu && v.discount === discount
    );

    if (existingItemIndex !== -1) {
      const updatedItems = dataItems.map((v, i) =>
        i === existingItemIndex
          ? {
              ...v,
              qty: Number(v.qty) + Number(quantity),
            }
          : v
      );
      setDataItems(updatedItems);
    } else {
      const totalPrice = ppu * quantity - discount;

      const newItem = {
        item: item.name,
        ppu: ppu,
        qty: quantity,
        discount: discount,
        totalPrice: totalPrice
      };

      setDataItems([...dataItems, newItem]);
    }
  };

  const clearDataItems = () => {
    setDataItems([]);
  };

  const deleteByIndex = (index) => {
    let newDataItems = [...dataItems];
    newDataItems.splice(index, 1);
    setDataItems(newDataItems);
  };

  const productChange = (e) => {
    const item = productList.find(v => e.target.value === v.code);
    setSelectedProduct(item.code);
    setPpu(item.price);
  };

  return (
    <Container>
      <Row>
        <Col md={4} style={{ backgroundColor: "#e4e4e4" }}>
          <Row>
            <Col>
              Item
              <Form.Select value={selectedProduct} onChange={productChange}>
                {productList.map(p => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Price Per Unit</Form.Label>
              <Form.Control
                type="number"
                value={ppu}
                onChange={(e) => setPpu(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                min="0"
              />
            </Col>
          </Row>
          <hr />
          <div className="d-grid gap-2">
            <Button variant="primary" onClick={addItem}>
              Add
            </Button>
          </div>
        </Col>
        <Col md={8}>
          <QuotationTable
            data={dataItems}
            clearDataItems={clearDataItems}
            deleteByIndex={deleteByIndex}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
