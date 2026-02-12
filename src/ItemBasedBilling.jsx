import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { Trash2, Download, Plus } from 'lucide-react';

const COMPANY_NAME = "Vighnaharta Transport Services";

// Amount to words conversion function
const convertAmountToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Lakh', 'Crore'];

  if (num === 0) return 'Zero';

  let words = '';
  let scaleIndex = 0;

  while (num > 0) {
    let groupNum = num % 1000;
    if (groupNum !== 0) {
      words = convertGroupToWords(groupNum, ones, teens, tens) + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + ' ' + words;
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return words.trim();
};

const convertGroupToWords = (num, ones, teens, tens) => {
  let result = '';

  const hundreds = Math.floor(num / 100);
  if (hundreds > 0) {
    result += ones[hundreds] + ' Hundred';
  }

  const remainder = num % 100;
  if (remainder >= 20) {
    if (result) result += ' ';
    result += tens[Math.floor(remainder / 10)];
    const onesDigit = remainder % 10;
    if (onesDigit > 0) {
      result += ' ' + ones[onesDigit];
    }
  } else if (remainder >= 10) {
    if (result) result += ' ';
    result += teens[remainder - 10];
  } else if (remainder > 0) {
    if (result) result += ' ';
    result += ones[remainder];
  }

  return result;
};

const pdfStyles = StyleSheet.create({
  page: { padding: 15, fontFamily: 'Helvetica', fontSize: 10 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc'
  },
  headerImage: { width: 35, height: 35 },
  headerText: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8
  },
  header: { fontSize: 12, fontWeight: 'bold', color: '#222266', marginBottom: 2 },
  subHeader: { fontSize: 7, color: '#444', marginBottom: 1 },
  detailsRow: { flexDirection: 'row', fontSize: 8, justifyContent: 'space-between', marginBottom: 6 },
  companyName: { fontSize: 9, marginBottom: 6, fontWeight: 'bold', color: '#231b80' },
  table: { display: 'table', width: 'auto', marginTop: 6, marginBottom: 6, borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { flexDirection: 'row', minHeight: 24 },
  tableColHeader: { width: '20%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#e9eaef', padding: 6, fontWeight: 'bold', fontSize: 9, color: '#101858' },
  tableCol: { width: '20%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, padding: 6, fontSize: 9 },
  tableColAmount: { width: '20%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, padding: 6, fontSize: 9, fontWeight: 'bold', color: '#252525', textAlign: 'right' },
  footer: { marginTop: 10, fontSize: 10, textAlign: 'left', color: '#2a297d', fontWeight: 'bold', marginBottom: 6 },
  signatureRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  words: { fontSize: 9, textAlign: 'left', width: '65%' },
  sign: { fontSize: 9, width: '35%', textAlign: 'right', marginTop: 40, marginRight: 30 }
});

const transportCompanyInfo = {
  name: "VIGHNAHARTA Transport Services",
  address: "A/P Ankalkhop, Tal: Palus, Dist: Sangli",
  pan: "PAN NO.: CKSPG8035P",
  contact: "Mob.: 7620272627 / 9730424588"
};

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formattedDate = (date) => {
  let day = date.split("-")[2];
  let month = date.split("-")[1];
  let year = date.split("-")[0];
  return `${day}/${month}/${year}`;
};

const ItemBillPDFDocument = ({ items, clientCompanyName, totalAmount, billNo }) => {
  const billDate = getCurrentDate();
  const amountInWords = convertAmountToWords(Math.floor(totalAmount));

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.headerContainer}>
          <View style={pdfStyles.headerText}>
            <Text style={pdfStyles.header}>{transportCompanyInfo.name}</Text>
            <Text style={pdfStyles.subHeader}>{transportCompanyInfo.pan}</Text>
            <Text style={pdfStyles.subHeader}>{transportCompanyInfo.address}</Text>
            <Text style={pdfStyles.subHeader}>{transportCompanyInfo.contact}</Text>
          </View>
        </View>

        <View style={pdfStyles.detailsRow}>
          <Text>Bill No.: {billNo}</Text>
          <Text>Bill Date: {formattedDate(billDate)}</Text>
        </View>
        <Text style={pdfStyles.companyName}>Company Name: {clientCompanyName}</Text>

        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <View style={pdfStyles.tableColHeader}><Text>Sr. No.</Text></View>
            <View style={pdfStyles.tableColHeader}><Text>Item Name</Text></View>
            <View style={pdfStyles.tableColHeader}><Text>Quantity</Text></View>
            <View style={pdfStyles.tableColHeader}><Text>Price</Text></View>
            <View style={pdfStyles.tableColHeader}><Text>Amount</Text></View>
          </View>
          {items.map((item, idx) => (
            <View style={pdfStyles.tableRow} key={item.id || idx}>
              <View style={pdfStyles.tableCol}><Text>{idx + 1}</Text></View>
              <View style={pdfStyles.tableCol}><Text>{item.itemName}</Text></View>
              <View style={pdfStyles.tableCol}><Text>{item.quantity}</Text></View>
              <View style={pdfStyles.tableCol}><Text>{Number(item.price).toFixed(2)}</Text></View>
              <View style={pdfStyles.tableColAmount}><Text>{Number(item.itemTotal).toFixed(2)}</Text></View>
            </View>
          ))}
        </View>

        <View style={pdfStyles.footer}>
          <Text>Total Amount: Rs {totalAmount.toFixed(2)}</Text>
        </View>
        <View style={pdfStyles.signatureRow}>
          <Text style={pdfStyles.words}>Rupees in words: {amountInWords} Rupees</Text>
          <Text style={pdfStyles.sign}>Signature / stamp</Text>
        </View>
      </Page>
    </Document>
  );
};

const ItemBasedBilling = () => {
  const [items, setItems] = useState([]);
  const [billNo, setBillNo] = useState(501);
  const [clientCompanyName, setClientCompanyName] = useState("V&M Tooling Pvt Ltd");
  const [form, setForm] = useState({
    itemName: "",
    quantity: "",
    price: ""
  });

  useEffect(() => {
    const savedItems = localStorage.getItem("itemBillingItems");
    const savedCompanyName = localStorage.getItem("itemBillingCompanyName");
    const savedBillNo = localStorage.getItem("itemBillingBillNo");

    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
    if (savedCompanyName) {
      setClientCompanyName(savedCompanyName);
    }
    if (savedBillNo) {
      setBillNo(Number(savedBillNo));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("itemBillingItems", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("itemBillingCompanyName", clientCompanyName);
  }, [clientCompanyName]);

  useEffect(() => {
    localStorage.setItem("itemBillingBillNo", billNo.toString());
  }, [billNo]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCompanyNameChange = (e) => {
    setClientCompanyName(e.target.value);
  };

  const addItem = (e) => {
    e.preventDefault();
    const { itemName, quantity, price } = form;

    if (!itemName || !quantity || !price) {
      alert("Please fill all item fields.");
      return;
    }

    const numericQuantity = Number(quantity);
    const numericPrice = Number(price);

    if (numericQuantity <= 0 || isNaN(numericQuantity)) {
      alert("Quantity must be a positive number");
      return;
    }

    if (numericPrice <= 0 || isNaN(numericPrice)) {
      alert("Price must be a positive number");
      return;
    }

    const newItem = {
      id: Date.now(),
      itemName: itemName.trim(),
      quantity: numericQuantity,
      price: numericPrice,
      itemTotal: numericQuantity * numericPrice
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setForm({ itemName: "", quantity: "", price: "" });
  };

  const deleteItem = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (confirmDelete) {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.itemTotal, 0);

  const generatePDFFileName = () => {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '_');
    const companyNameFormatted = clientCompanyName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    return `${companyNameFormatted}_items_${today}.pdf`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '40px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <h1 style={{ textAlign: 'center', color: '#2d3748', margin: '0 0 10px 0', fontSize: '32px', fontWeight: '700' }}>
            {COMPANY_NAME}
          </h1>
          <p style={{ textAlign: 'center', color: '#718096', margin: '0', fontSize: '14px' }}>
            Item Based Bill & Invoice Management System
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '30px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#2d3748', marginTop: '0', marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
              Add Item
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#4a5568', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Customer Name
              </label>
              <input
                type="text"
                value={clientCompanyName}
                onChange={handleCompanyNameChange}
                placeholder="Enter company name"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.3s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#4a5568', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Bill Number
              </label>
              <input
                type="number"
                value={billNo}
                min={1}
                step={1}
                onChange={e => setBillNo(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <hr style={{ border: 'none', borderTop: '2px solid #e2e8f0', margin: '24px 0' }} />

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#4a5568', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Item Name
              </label>
              <input
                name="itemName"
                type="text"
                placeholder="Enter item name"
                value={form.itemName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#4a5568', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Quantity
              </label>
              <input
                name="quantity"
                type="number"
                placeholder="0"
                step="0.01"
                value={form.quantity}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#4a5568', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Price per Unit (₹)
              </label>
              <input
                name="price"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <button
              onClick={addItem}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <Plus size={20} /> Add Item
            </button>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#2d3748', marginTop: '0', marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
              Summary
            </h2>

            <div style={{ marginBottom: '20px', padding: '16px', background: '#f7fafc', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
              <p style={{ margin: '0 0 8px 0', color: '#718096', fontSize: '14px' }}>Total Items</p>
              <p style={{ margin: '0', color: '#2d3748', fontSize: '32px', fontWeight: '700' }}>{items.length}</p>
            </div>

            <div style={{ marginBottom: '20px', padding: '16px', background: '#f7fafc', borderRadius: '8px', borderLeft: '4px solid #48bb78' }}>
              <p style={{ margin: '0 0 8px 0', color: '#718096', fontSize: '14px' }}>Total Amount</p>
              <p style={{ margin: '0', color: '#2d3748', fontSize: '32px', fontWeight: '700' }}>₹ {totalAmount.toFixed(2)}</p>
            </div>

            <div style={{ marginBottom: '20px', padding: '16px', background: '#f7fafc', borderRadius: '8px', borderLeft: '4px solid #764ba2' }}>
              <p style={{ margin: '0 0 8px 0', color: '#718096', fontSize: '14px' }}>Bill Number</p>
              <p style={{ margin: '0', color: '#2d3748', fontSize: '28px', fontWeight: '700' }}>#{billNo}</p>
            </div>

            {items.length > 0 && (
              <PDFDownloadLink
                key={items.length}
                document={<ItemBillPDFDocument items={items} clientCompanyName={clientCompanyName} totalAmount={totalAmount} billNo={billNo} />}
                fileName={generatePDFFileName()}
              >
                {({ loading }) => (
                  <button style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'transform 0.2s',
                  }}
                    onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <Download size={20} /> {loading ? 'Generating PDF...' : 'Download Bill Report'}
                  </button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
          <h2 style={{ color: '#2d3748', marginTop: '0', marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
            Item List
          </h2>

          {items.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '14px' }}>Sr. No.</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '14px' }}>Item Name</th>
                  <th style={{ padding: '16px', textAlign: 'center', color: '#4a5568', fontWeight: '600', fontSize: '14px' }}>Quantity</th>
                  <th style={{ padding: '16px', textAlign: 'right', color: '#4a5568', fontWeight: '600', fontSize: '14px' }}>Price</th>
                  <th style={{ padding: '16px', textAlign: 'right', color: '#4a5568', fontWeight: '600', fontSize: '14px' }}>Total</th>
                  <th style={{ padding: '16px', textAlign: 'center', color: '#4a5568', fontWeight: '600', fontSize: '14px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f7fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '16px', color: '#2d3748', fontSize: '14px' }}>{idx + 1}</td>
                    <td style={{ padding: '16px', color: '#2d3748', fontSize: '14px', fontWeight: '600' }}>{item.itemName}</td>
                    <td style={{ padding: '16px', color: '#2d3748', fontSize: '14px', textAlign: 'center' }}>{Number(item.quantity).toFixed(2)}</td>
                    <td style={{ padding: '16px', color: '#2d3748', fontSize: '14px', textAlign: 'right' }}>₹{Number(item.price).toFixed(2)}</td>
                    <td style={{ padding: '16px', color: '#2d3748', fontSize: '14px', fontWeight: '600', textAlign: 'right' }}>₹{Number(item.itemTotal).toFixed(2)}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => deleteItem(item.id)}
                        style={{
                          padding: '8px 12px',
                          background: '#fed7d7',
                          color: '#c53030',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#fc8181';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#fed7d7';
                          e.target.style.color = '#c53030';
                        }}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#718096' }}>
              <p style={{ fontSize: '16px', margin: '0' }}>No items added yet. Start by adding your first item!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemBasedBilling;