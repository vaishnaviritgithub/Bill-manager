import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink , Image } from '@react-pdf/renderer'; 

import headerLeft from './ganpati.png';  
import headerRight from './truck.png'; 

import "./App.css";

const COMMON_COMPANY_NAME = "Vighnaharta Transport Services";

const pdfStyles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  header: { fontSize: 20, textAlign: 'center', marginBottom: 2, fontWeight: 'bold', color: '#222266' },
  subHeader: { fontSize: 11, textAlign: 'center', marginBottom: 1, color: '#444' },
  detailsRow: { flexDirection: 'row', fontSize: 11, justifyContent: 'space-between', marginBottom: 3 },
  companyName: { fontSize: 12, marginBottom: 4, fontWeight: 'bold', color: '#231b80' },
  table: { display: 'table', width: 'auto', marginTop: 10, borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { flexDirection: 'row' },
  tableColHeader: { width: '20%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#e9eaef', padding: 8, fontWeight: 'bold', fontSize: 11, color: '#101858' },
  tableCol: { width: '20%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, padding: 8, fontSize: 10 },
  tableColAmount: { width: '20%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, padding: 8, fontSize: 11, fontWeight: 'bold', color: '#252525', textAlign: 'right' },
  footer: { marginTop: 24, fontSize: 12, textAlign: 'right', color: '#2a297d', fontWeight: 'bold' },
  signatureRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 36 },
  words: { fontSize: 11, width: '65%' },
  sign: { fontSize: 11, width: '35%', textAlign: 'right' }
});

const transportCompanyInfo = {
  name: "VIGHNAHARTA Transport Services",
  address: "A/P AnkaliKhurd, Tal: Palus, Dist: Sangli/Totala",
  pan: "PAN NO.: CKPSG9803F",
  contact: "Mob.: 7620727627 / 9730442588"
};


const clientCompanyName = "V&M Toolings PVT. LTD., Kagal";

const MyBillDocument = ({ bills }) => {
  const totalAmount = bills.reduce((sum, bill) => sum + Number(bill.amount), 0);

  // Get billNo and date from first bill, or default
  const billNo = bills[0]?.billNo || "122"; 
  const billDate = bills[0]?.date || new Date().toLocaleDateString('en-GB');

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>


<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Image src={headerLeft} style={{ width: 50, height: 50 }} />
          <Image src={headerRight} style={{ width: 50, height: 50 }} />
        </View>

       
        <Text style={pdfStyles.header}>{transportCompanyInfo.name}</Text>
        <Text style={pdfStyles.subHeader}>{transportCompanyInfo.pan}</Text>
        <Text style={pdfStyles.subHeader}>{transportCompanyInfo.address}</Text>
        <Text style={pdfStyles.subHeader}>{transportCompanyInfo.contact}</Text>
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
          {bills.map((bill, idx) => (
            <View style={pdfStyles.tableRow} key={bill.id || idx}>
              <View style={pdfStyles.tableCol}><Text>{idx + 1}</Text></View>
              <View style={pdfStyles.tableCol}><Text>{bill.date}</Text></View>
              <View style={pdfStyles.tableCol}><Text>{bill.from}</Text></View>
              <View style={pdfStyles.tableCol}><Text>{bill.to}</Text></View>
              <View style={pdfStyles.tableColAmount}><Text>{Number(bill.amount).toFixed(2)}</Text></View>
            </View>
          ))}
        </View>
        {/* Footer */}
        <View style={pdfStyles.footer}>
          <Text>Total Amount: Rs {totalAmount.toFixed(2)}</Text>
        </View>
        <View style={pdfStyles.signatureRow}>
          <Text style={pdfStyles.words}>Rupees in words: _______________________</Text>
          <Text style={pdfStyles.sign}>Signature / stamp</Text>
        </View>
      </Page>
    </Document>
  );
};
const BillManager = () => {
    const [bills, setBills] = useState([]);
    const [billNo, setBillNo] = useState(122);
    const [form, setForm] = useState({
        date: "",
        from: "",
        to: "",
        amount: ""
    });

    useEffect(() => {
        const savedBills = localStorage.getItem("bills");
        if (savedBills) {
            setBills(JSON.parse(savedBills));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("bills", JSON.stringify(bills));
    }, [bills]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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
        setBills([...bills, newBill]);
        setForm({ date: "", from: "", to: "", amount: "" });
    };

    const deleteBill = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this bill entry?");
        if (confirmDelete) {
            const updatedBills = bills.filter(bill => bill.id !== id);
            setBills(updatedBills);
        }
    };

    return (
        <div className="bill-manager-container">
            <h1 style={{textAlign: 'center', color: '#4c68e3ff'}}>{COMMON_COMPANY_NAME}</h1>
            <hr style={{ border: 'none', borderBottom: '1px solid #d6cfeeff', margin: '20px 0' }} />
            <h2>Add Individual Bill Entry</h2>
            <div className="common-input-section" style={{textAlign: 'right', }}>
              <p style={{ fontWeight: 'bold', margin: 0, fontSize: '1rem', color: '#000000ff' }}>Company Name</p>
 
              <p style={{ fontWeight: 'bold', margin: 0, fontSize: '1rem', color: '#402ae4ff' }}>V&M Tooling Pvt Ltd</p>
                <p style={{ fontWeight: 'bold', margin: 0, fontSize: '1rem', color: '#0a052dff' }}>Bill Number</p>
                <input
                    type="number"
                    value={billNo}
                    min={1}
                    step={1}
                    onChange={e => setBillNo(Number(e.target.value))}
                    style={{
                        width: 50,
                        padding: 4,
                        fontSize: '1rem',
                        border: '1px solid #4e20e8ff',
                        borderRadius: 4,
                        color: '#4624ccff',
                        textAlign: 'right'
                    }}
                />
            </div>
            <form onSubmit={addBill}>
                <input name="date" type="date" placeholder="Date" value={form.date} onChange={handleChange} required />
                <input name="from" placeholder="From" value={form.from} onChange={handleChange} required />
                <input name="to" placeholder="To" value={form.to} onChange={handleChange} required />
                <input name="amount" type="number" placeholder="Amount (₹)" value={form.amount} onChange={handleChange} required />
                <button type="submit" className="submit-btn">Add Entry</button>
            </form>
            <hr style={{ border: 'none', borderBottom: '1px solid #ddd', margin: '20px 0' }} />
            <h3>Bill Data</h3>
            <table>
                <thead>
                    <tr>
                        <th>Sr. no.</th>
                        <th>Bill No</th>
                        <th>Date</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bills.length > 0 ? (
                        bills.map((bill, idx) => (
                            <tr key={bill.id}>
                                <td>{idx + 1}</td>
                                <td>{bill.billNo}</td>
                                <td>{bill.date}</td>
                                <td>{bill.from}</td>
                                <td>{bill.to}</td>
                                <td>₹{Number(bill.amount).toFixed(2)}</td>
                                <td>
                                    <button 
                                        onClick={() => deleteBill(bill.id)} 
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center' }}>No bills added yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {bills.length > 0 ? (
               <PDFDownloadLink
  key={bills.length}
  document={<MyBillDocument bills={bills} />} 
  fileName="bill-report.pdf"
>
  {({ loading }) => (
    <button style={{ marginTop: 25 }}>
      {loading ? 'Generating PDF...' : 'Download Bill Report (PDF)'}
    </button>
  )}
</PDFDownloadLink>
            ) : (
                <button style={{ marginTop: 25, opacity: 0.6, cursor: 'not-allowed' }} disabled>
                    Add bills to enable download
                </button>
            )}
        </div>
    );
};

export default BillManager;