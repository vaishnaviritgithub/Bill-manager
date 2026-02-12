import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { Trash2, Download, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ganpatiImage from './ganpati.png';

const COMPANY_NAME = "Moraya Traders";
const COMPANY_INFO = {
  name: "MORAYA TRADERS",
  address: "Talandge, Maharashtra",
  // pan: "PAN NO.: MORAYA123PAN",
  contact: "Mob.: 9730424588"
};

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
  page: { 
    padding: 20, 
    fontFamily: 'Helvetica', 
    fontSize: 10,
    backgroundColor: '#ffffff'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#e74c3c'
  },
  headerImage: {
    width: 45,
    height: 45,
    marginRight: 15
  },
  headerContent: {
    flex: 1
  },
  headerText: {
    flex: 1,
    textAlign: 'left'
  },
  estimateTag: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 3
  },
  header: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#1f2937', 
    marginBottom: 2
  },
  subHeader: { 
    fontSize: 8, 
    color: '#555', 
    marginBottom: 1,
    lineHeight: 1.3
  },
  customerSection: {
    marginBottom: 15,
    fontSize: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 8
  },
  customerLabel: {
    fontWeight: 'bold',
    marginBottom: 2
  },
  detailsRow: { 
    flexDirection: 'row', 
    fontSize: 9, 
    justifyContent: 'space-between', 
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc'
  },
  companyName: { 
    fontSize: 9, 
    marginBottom: 8, 
    fontWeight: 'bold', 
    color: '#1f2937'
  },
  table: { 
    display: 'table', 
    width: '100%',
    marginTop: 8, 
    marginBottom: 12, 
    borderStyle: 'solid', 
    borderWidth: 1, 
    borderColor: '#000000'
  },
  // tableRow: { 
  //   flexDirection: 'row', 
  //   minHeight: 26,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#000000'
  // }
  tableRow: {  
  flexDirection: 'row',
  minHeight: 26,
  borderBottomWidth: 1,
  borderBottomColor: '#000000',
  alignItems: 'stretch'   // ensures all cells same height
}
,
  tableColHeaderSmall: { 
    width: '8%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    backgroundColor: '#f5f5f5', 
    padding: 7, 
    fontWeight: 'bold', 
    fontSize: 8, 
    color: '#1f2937',
    textAlign: 'center'
  },
  tableColHeaderLarge: { 
    width: '45%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    backgroundColor: '#f5f5f5', 
    padding: 7, 
    fontWeight: 'bold', 
    fontSize: 8, 
    color: '#1f2937',
    textAlign: 'center'
  },
tableColHeaderMedium: {  
  width: '15.66%',
  borderRightWidth: 1,
  borderRightColor: '#000000',
  backgroundColor: '#f5f5f5',
  padding: 7,
  fontWeight: 'bold',
  fontSize: 8,
  color: '#1f2937',
  textAlign: 'center'
}
  ,
  tableColSmall: { 
    width: '8%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    padding: 7, 
    fontSize: 8,
    textAlign: 'center'
  },
  tableColLarge: { 
    width: '45%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    padding: 7, 
    fontSize: 8,
    textAlign: 'left'
  },
  tableColMedium: { 
    width: '15.66%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    padding: 7, 
    fontSize: 8,
    textAlign: 'center'
  },
tableColAmount: {  
  width: '15.66%',      // FIX: match header width
  padding: 7,
  fontSize: 8,
  fontWeight: 'bold',
  color: '#1f2937',
  textAlign: 'right'
},
  footer: { 
    marginTop: 12, 
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#000000',
    fontSize: 9, 
    textAlign: 'right', 
    color: '#1f2937', 
    fontWeight: 'bold'
  },
  totalAmount: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'right'
  },
  signatureRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 18,
    paddingTop: 12
  },
  words: { 
    fontSize: 8, 
    textAlign: 'left', 
    width: '60%',
    lineHeight: 1.4
  },
  wordsLabel: {
    fontWeight: 'bold',
    marginBottom: 2
  },
  sign: { 
    fontSize: 8, 
    width: '35%', 
    textAlign: 'center',
    paddingTop: 25
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 3,
    marginBottom: 2
  }
});

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

const ItemPDFDocument = ({ items, clientCompanyName, totalAmount, billNo }) => {
  const billDate = getCurrentDate();
  const amountInWords = convertAmountToWords(Math.floor(totalAmount));

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* Header with Image and Company Info */}
        <View style={pdfStyles.headerContainer}>
          <Image src={ganpatiImage} style={pdfStyles.headerImage} />
          <View style={pdfStyles.headerContent}>
            {/* <Text style={pdfStyles.estimateTag}>ESTIMATE</Text> */}
            <Text style={pdfStyles.header}>{COMPANY_INFO.name}</Text>
            <Text style={pdfStyles.subHeader}>{COMPANY_INFO.address}</Text>
            <Text style={pdfStyles.subHeader}>{COMPANY_INFO.contact}</Text>
          </View>
        </View>

        {/* Customer Details */}
        <View style={pdfStyles.customerSection}>
          <Text style={pdfStyles.customerLabel}>To</Text>
          <Text style={pdfStyles.companyName}>{clientCompanyName}</Text>
        </View>

        {/* Details Row */}
        <View style={pdfStyles.detailsRow}>
          <Text style={{ fontSize: 9 }}>Date: {formattedDate(billDate)}</Text>
        </View>

        {/* Table */}
        <View style={pdfStyles.table}>
          {/* Table Header */}
          <View style={pdfStyles.tableRow}>
            <View style={pdfStyles.tableColHeaderSmall}><Text>Sr. No.</Text></View>
            <View style={pdfStyles.tableColHeaderLarge}><Text>PARTICULARS</Text></View>
            <View style={pdfStyles.tableColHeaderMedium}><Text>QTY.</Text></View>
            <View style={pdfStyles.tableColHeaderMedium}><Text>RATE</Text></View>
            <View style={pdfStyles.tableColHeaderMedium}><Text>AMOUNT</Text></View>
          </View>

          {/* Table Rows */}
          {items.map((item, idx) => (
            <View style={pdfStyles.tableRow} key={item.id || idx}>
              <View style={pdfStyles.tableColSmall}><Text>{idx + 1}</Text></View>
              <View style={pdfStyles.tableColLarge}><Text>{item.itemName}</Text></View>
              <View style={pdfStyles.tableColMedium}><Text>{Number(item.quantity).toFixed(2)}</Text></View>
              <View style={pdfStyles.tableColMedium}><Text>{Number(item.price).toFixed(2)}</Text></View>
              <View style={pdfStyles.tableColAmount}><Text>{Number(item.itemTotal).toFixed(2)}</Text></View>
            </View>
          ))}
        </View>

        {/* Footer with Total */}
        <View style={pdfStyles.footer}>
          <Text style={pdfStyles.totalAmount}>Total: Rs {totalAmount.toFixed(2)}</Text>
        </View>

        {/* Signature Section */}
        <View style={pdfStyles.signatureRow}>
          <View style={pdfStyles.words}>
            <Text style={pdfStyles.wordsLabel}>Rupees in words:</Text>
            <Text>{amountInWords} Rupees</Text>
          </View>
          <View style={pdfStyles.sign}>
            <View style={pdfStyles.signatureLine}></View>
            <Text>Signature / Stamp</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const MorayaTradersManager = () => {
  const [items, setItems] = useState([]);
  const [billNo, setBillNo] = useState(501);
  const [clientCompanyName, setClientCompanyName] = useState("Customer Company");
  const [form, setForm] = useState({
    itemName: "",
    quantity: "",
    price: ""
  });

  useEffect(() => {
    const savedItems = localStorage.getItem("moraya_items");
    const savedCompanyName = localStorage.getItem("moraya_clientCompanyName");
    const savedBillNo = localStorage.getItem("moraya_billNo");

    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedCompanyName) setClientCompanyName(savedCompanyName);
    if (savedBillNo) setBillNo(Number(savedBillNo));
  }, []);

  useEffect(() => {
    localStorage.setItem("moraya_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("moraya_clientCompanyName", clientCompanyName);
  }, [clientCompanyName]);

  useEffect(() => {
    localStorage.setItem("moraya_billNo", billNo.toString());
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

    setItems([...items, newItem]);
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
    return `Moraya_Estimate_${companyNameFormatted}_${today}.pdf`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header with Back Button */}
        <div style={{ marginBottom: '30px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '10px 16px',
              background: 'white',
              color: '#059669',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateX(-4px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateX(0)';
              e.target.style.boxShadow = 'none';
            }}>
              <ArrowLeft size={18} /> Back to Home
            </button>
          </Link>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '40px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <h1 style={{ textAlign: 'center', color: '#1f2937', margin: '0 0 10px 0', fontSize: '32px', fontWeight: '700' }}>
            📦 {COMPANY_NAME}
          </h1>
          <p style={{ textAlign: 'center', color: '#6b7280', margin: '0', fontSize: '14px' }}>
            Professional Estimate & Invoice Management System
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '30px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#1f2937', marginTop: '0', marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
              Add Item
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#374151', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Customer Name
              </label>
              <input
                type="text"
                value={clientCompanyName}
                onChange={handleCompanyNameChange}
                placeholder="Enter customer name"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#059669'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <hr style={{ border: 'none', borderTop: '2px solid #e5e7eb', margin: '24px 0' }} />

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#374151', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Item Name / Particulars
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
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#059669'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#374151', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
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
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#059669'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#374151', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Rate (₹)
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
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#059669'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <button
              onClick={addItem}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
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
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <Plus size={20} /> Add Item
            </button>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#1f2937', marginTop: '0', marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
              Summary
            </h2>

            <div style={{ marginBottom: '20px', padding: '16px', background: '#f0fdf4', borderRadius: '8px', borderLeft: '4px solid #059669' }}>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px' }}>Total Items</p>
              <p style={{ margin: '0', color: '#1f2937', fontSize: '32px', fontWeight: '700' }}>{items.length}</p>
            </div>

            <div style={{ marginBottom: '20px', padding: '16px', background: '#f0fdf4', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px' }}>Total Amount</p>
              <p style={{ margin: '0', color: '#1f2937', fontSize: '32px', fontWeight: '700' }}>₹ {totalAmount.toFixed(2)}</p>
            </div>

            {/* <div style={{ marginBottom: '20px', padding: '16px', background: '#f0fdf4', borderRadius: '8px', borderLeft: '4px solid #059669' }}>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px' }}>Estimate Number</p>
              <p style={{ margin: '0', color: '#1f2937', fontSize: '28px', fontWeight: '700' }}>#{billNo}</p>
            </div> */}

            {items.length > 0 && (
              <PDFDownloadLink
                key={items.length}
                document={<ItemPDFDocument items={items} clientCompanyName={clientCompanyName} totalAmount={totalAmount} billNo={billNo} />}
                fileName={generatePDFFileName()}
              >
                {({ loading }) => (
                  <button style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: loading ? '#d1d5db' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
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
                    transition: 'transform 0.2s'
                  }}
                    onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <Download size={20} /> {loading ? 'Generating PDF...' : 'Download Estimate'}
                  </button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
          <h2 style={{ color: '#1f2937', marginTop: '0', marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
            Items List
          </h2>

          {items.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '16px', textAlign: 'center', color: '#374151', fontWeight: '600', fontSize: '14px', width: '10%' }}>Sr. No.</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#374151', fontWeight: '600', fontSize: '14px', width: '45%' }}>Item Name</th>
                  <th style={{ padding: '16px', textAlign: 'center', color: '#374151', fontWeight: '600', fontSize: '14px', width: '15%' }}>Quantity</th>
                  <th style={{ padding: '16px', textAlign: 'right', color: '#374151', fontWeight: '600', fontSize: '14px', width: '15%' }}>Rate</th>
                  <th style={{ padding: '16px', textAlign: 'right', color: '#374151', fontWeight: '600', fontSize: '14px', width: '15%' }}>Amount</th>
                  <th style={{ padding: '16px', textAlign: 'center', color: '#374151', fontWeight: '600', fontSize: '14px', width: '10%' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '16px', color: '#1f2937', fontSize: '14px', textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ padding: '16px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>{item.itemName}</td>
                    <td style={{ padding: '16px', color: '#1f2937', fontSize: '14px', textAlign: 'center' }}>{Number(item.quantity).toFixed(2)}</td>
                    <td style={{ padding: '16px', color: '#1f2937', fontSize: '14px', textAlign: 'right' }}>₹{Number(item.price).toFixed(2)}</td>
                    <td style={{ padding: '16px', color: '#1f2937', fontSize: '14px', fontWeight: '600', textAlign: 'right' }}>₹{Number(item.itemTotal).toFixed(2)}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => deleteItem(item.id)}
                        style={{
                          padding: '8px 12px',
                          background: '#fee2e2',
                          color: '#dc2626',
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
                          e.target.style.background = '#fca5a5';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#fee2e2';
                          e.target.style.color = '#dc2626';
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
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
              <p style={{ fontSize: '16px', margin: '0' }}>No items added yet. Start by adding your first item!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MorayaTradersManager;