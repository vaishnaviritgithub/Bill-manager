import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer'; 
import { Trash2, Download, Plus } from 'lucide-react';

import headerLeft from './ganpati.png';  
import headerRight from './truck.png'; 

import "./App.css";

const COMMON_COMPANY_NAME = "Vighnaharta Transport Services";

// Function to convert amount to words
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
  page: { padding: 20, fontFamily: 'Helvetica', fontSize: 10 },
  headerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc'
  },
  headerImage: { width: 40, height: 40 },
  headerText: { 
    flex: 1, 
    textAlign: 'center',
    marginHorizontal: 10
  },
  header: { fontSize: 14, fontWeight: 'bold', color: '#222266', marginBottom: 2 },
  subHeader: { fontSize: 8, color: '#444', marginBottom: 1 },
  detailsRow: { flexDirection: 'row', fontSize: 9, justifyContent: 'space-between', marginBottom: 8 },
  companyName: { fontSize: 10, marginBottom: 8, fontWeight: 'bold', color: '#231b80' },
  table: { display: 'table', width: 'auto', marginTop: 8, marginBottom: 8, borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { flexDirection: 'row' },
  tableColHeader: { width: '20%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#e9eaef', padding: 4, fontWeight: 'bold', fontSize: 8, color: '#101858' },
  tableCol: { width: '20%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, padding: 4, fontSize: 8 },
  tableColAmount: { width: '20%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, padding: 4, fontSize: 8, fontWeight: 'bold', color: '#252525', textAlign: 'right' },
  footer: { marginTop: 12, fontSize: 10, textAlign: 'right', color: '#2a297d', fontWeight: 'bold', marginBottom: 8 },
  signatureRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  words: { fontSize: 9, width: '65%' },
  sign: { fontSize: 9, width: '35%', textAlign: 'right' }
});

const transportCompanyInfo = {
  name: "VIGHNAHARTA Transport Services",
  address: "A/P Ankalkhop, Tal: Palus, Dist: Sangli",
  pan: "PAN NO.: CKPSG9803F",
  contact: "Mob.: 7620727627 / 9730442588"
};

const MyBillDocument = ({ bills, clientCompanyName, totalAmount }) => {
  const billNo = bills[0]?.billNo || "122"; 
  const billDate = bills[0]?.date || new Date().toLocaleDateString('en-GB');
  const amountInWords = convertAmountToWords(Math.floor(totalAmount));
  
  // Split bills into chunks of 20 per page
  const billsPerPage = 20;
  const pages = [];
  for (let i = 0; i < bills.length; i += billsPerPage) {
    pages.push(bills.slice(i, i + billsPerPage));
  }

  return (
    <Document>
      {pages.map((pageBills, pageIndex) => (
        <Page key={pageIndex} size="A4" style={pdfStyles.page}>
          {/* Header with Images and Text */}
          <View style={pdfStyles.headerContainer}>
            <Image src={headerLeft} style={pdfStyles.headerImage} />
            <View style={pdfStyles.headerText}>
              <Text style={pdfStyles.header}>{transportCompanyInfo.name}</Text>
              <Text style={pdfStyles.subHeader}>{transportCompanyInfo.pan}</Text>
              <Text style={pdfStyles.subHeader}>{transportCompanyInfo.address}</Text>
              <Text style={pdfStyles.subHeader}>{transportCompanyInfo.contact}</Text>
            </View>
            <Image src={headerRight} style={pdfStyles.headerImage} />
          </View>

          {/* Bill Details */}
          <View style={pdfStyles.detailsRow}>
            <Text>Bill No.: {billNo}</Text>
            <Text>Date: {billDate}</Text>
          </View>
          <Text style={pdfStyles.companyName}>Company Name: {clientCompanyName}</Text>

          {/* Table */}
          <View style={pdfStyles.table}>
            <View style={pdfStyles.tableRow}>
              <View style={pdfStyles.tableColHeader}><Text>Sr. no.</Text></View>
              <View style={pdfStyles.tableColHeader}><Text>Date</Text></View>
              <View style={pdfStyles.tableColHeader}><Text>From</Text></View>
              <View style={pdfStyles.tableColHeader}><Text>To</Text></View>
              <View style={pdfStyles.tableColHeader}><Text>Amount</Text></View>
            </View>
            {pageBills.map((bill, idx) => (
              <View style={pdfStyles.tableRow} key={bill.id || idx}>
                <View style={pdfStyles.tableCol}><Text>{pageIndex * billsPerPage + idx + 1}</Text></View>
                <View style={pdfStyles.tableCol}><Text>{bill.date}</Text></View>
                <View style={pdfStyles.tableCol}><Text>{bill.from}</Text></View>
                <View style={pdfStyles.tableCol}><Text>{bill.to}</Text></View>
                <View style={pdfStyles.tableColAmount}><Text>{Number(bill.amount).toFixed(2)}</Text></View>
              </View>
            ))}
          </View>

          {/* Footer and Signature */}
          {pageIndex === pages.length - 1 && (
            <>
              <View style={pdfStyles.footer}>
                <Text>Total Amount: Rs {totalAmount.toFixed(2)}</Text>
              </View>
              <View style={pdfStyles.signatureRow}>
                <Text style={pdfStyles.words}>Rupees in words: {amountInWords} Rupees</Text>
                <Text style={pdfStyles.sign}>Signature / stamp</Text>
              </View>
            </>
          )}
        </Page>
      ))}
    </Document>
  );
};

const BillManager = () => {
    const [bills, setBills] = useState([]);
    const [billNo, setBillNo] = useState(122);
    const [clientCompanyName, setClientCompanyName] = useState("V&M Tooling Pvt Ltd");
    const [form, setForm] = useState({
        date: "",
        from: "",
        to: "",
        amount: ""
    });

    useEffect(() => {
        const savedBills = localStorage.getItem("bills");
        const savedCompanyName = localStorage.getItem("clientCompanyName");
        if (savedBills) {
            setBills(JSON.parse(savedBills));
        }
        if (savedCompanyName) {
            setClientCompanyName(savedCompanyName);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("bills", JSON.stringify(bills));
    }, [bills]);

    useEffect(() => {
        localStorage.setItem("clientCompanyName", clientCompanyName);
    }, [clientCompanyName]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCompanyNameChange = (e) => {
        setClientCompanyName(e.target.value);
    };

    const addBill = (e) => {
        e.preventDefault();
        const { date, from, to, amount } = form;
        if (!date || !from || !to || !amount) {
            alert("Please fill all Bill Entry fields.");
            return;
        }
        const numericAmount = Number(amount);
        if (numericAmount <= 0 || isNaN(numericAmount)) {
            alert("Amount must be a positive number");
            return;
        }
        const newBill = { 
            ...form, 
            id: Date.now(),
            companyName: COMMON_COMPANY_NAME,
            billNo 
        }; 
        
        const updatedBills = [...bills, newBill];
        updatedBills.sort((a, b) => new Date(a.date) - new Date(b.date));
        setBills(updatedBills);
        setForm({ date: "", from: "", to: "", amount: "" });
    };

    const deleteBill = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this bill entry?");
        if (confirmDelete) {
            const updatedBills = bills.filter(bill => bill.id !== id);
            setBills(updatedBills);
        }
    };

    const totalAmount = bills.reduce((sum, bill) => sum + Number(bill.amount), 0);

    // Generate PDF filename with company name and date
    const generatePDFFileName = () => {
        const today = new Date().toISOString().split('T')[0].replace(/-/g, '_');
        const companyNameFormatted = clientCompanyName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        return `${companyNameFormatted}_${today}.pdf`;
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header Section */}
                <div style={{ background: 'white', borderRadius: '12px', padding: '40px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                    <h1 style={{ textAlign: 'center', color: '#2d3748', margin: '0 0 10px 0', fontSize: '32px', fontWeight: '700' }}>
                        {COMMON_COMPANY_NAME}
                    </h1>
                    <p style={{ textAlign: 'center', color: '#718096', margin: '0', fontSize: '14px' }}>
                        Professional Bill & Invoice Management System
                    </p>
                </div>

                {/* Main Content */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '30px' }}>
                    {/* Form Card */}
                    <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ color: '#2d3748', marginTop: '0', marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
                            Add Bill Entry
                        </h2>

                        {/* Company Name Input */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: '#4a5568', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                Company Name
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

                        {/* Bill Number */}
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

                        {/* Form Inputs */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', color: '#4a5568', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                Date
                            </label>
                            <input 
                                name="date" 
                                type="date" 
                                value={form.date} 
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
                                From
                            </label>
                            <input 
                                name="from" 
                                placeholder="Origin location" 
                                value={form.from} 
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
                                To
                            </label>
                            <input 
                                name="to" 
                                placeholder="Destination location" 
                                value={form.to} 
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
                                Amount (₹)
                            </label>
                            <input 
                                name="amount" 
                                type="number" 
                                placeholder="0.00" 
                                value={form.amount} 
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
                            onClick={addBill}
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
                            <Plus size={20} /> Add Entry
                        </button>
                    </div>

                    {/* Summary Card */}
                    <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ color: '#2d3748', marginTop: '0', marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
                            Summary
                        </h2>
                        
                        <div style={{ marginBottom: '20px', padding: '16px', background: '#f7fafc', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                            <p style={{ margin: '0 0 8px 0', color: '#718096', fontSize: '14px' }}>Total Entries</p>
                            <p style={{ margin: '0', color: '#2d3748', fontSize: '32px', fontWeight: '700' }}>{bills.length}</p>
                        </div>

                        <div style={{ marginBottom: '20px', padding: '16px', background: '#f7fafc', borderRadius: '8px', borderLeft: '4px solid #48bb78' }}>
                            <p style={{ margin: '0 0 8px 0', color: '#718096', fontSize: '14px' }}>Total Amount</p>
                            <p style={{ margin: '0', color: '#2d3748', fontSize: '32px', fontWeight: '700' }}>₹ {totalAmount.toFixed(2)}</p>
                        </div>

                        <div style={{ marginBottom: '20px', padding: '16px', background: '#f7fafc', borderRadius: '8px', borderLeft: '4px solid #764ba2' }}>
                            <p style={{ margin: '0 0 8px 0', color: '#718096', fontSize: '14px' }}>Bill Number</p>
                            <p style={{ margin: '0', color: '#2d3748', fontSize: '28px', fontWeight: '700' }}>#{billNo}</p>
                        </div>

                        {bills.length > 0 && (
                            <PDFDownloadLink
                                key={bills.length}
                                document={<MyBillDocument bills={bills} clientCompanyName={clientCompanyName} totalAmount={totalAmount} />} 
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

                {/* Data Table */}
                <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
                    <h2 style={{ color: '#2d3748', marginTop: '0', marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
                        Bill Entries
                    </h2>
                    
                    {bills.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '14px' }}>Sr. No.</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '14px' }}>Bill No.</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '14px' }}>Date</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '14px' }}>From</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '14px' }}>To</th>
                                    <th style={{ padding: '16px', textAlign: 'right', color: '#4a5568', fontWeight: '600', fontSize: '14px' }}>Amount</th>
                                    <th style={{ padding: '16px', textAlign: 'center', color: '#4a5568', fontWeight: '600', fontSize: '14px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.map((bill, idx) => (
                                    <tr key={bill.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f7fafc'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                    >
                                        <td style={{ padding: '16px', color: '#2d3748', fontSize: '14px' }}>{idx + 1}</td>
                                        <td style={{ padding: '16px', color: '#2d3748', fontSize: '14px', fontWeight: '600' }}>{bill.billNo}</td>
                                        <td style={{ padding: '16px', color: '#2d3748', fontSize: '14px' }}>{bill.date}</td>
                                        <td style={{ padding: '16px', color: '#2d3748', fontSize: '14px' }}>{bill.from}</td>
                                        <td style={{ padding: '16px', color: '#2d3748', fontSize: '14px' }}>{bill.to}</td>
                                        <td style={{ padding: '16px', color: '#2d3748', fontSize: '14px', fontWeight: '600', textAlign: 'right' }}>₹{Number(bill.amount).toFixed(2)}</td>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                            <button 
                                                onClick={() => deleteBill(bill.id)}
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
                            <p style={{ fontSize: '16px', margin: '0' }}>No bills added yet. Start by adding your first entry!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BillManager;