const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '..', 'data', 'whitemist_db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const initialCustomerLogins = [
  {
    id: 'c-log-1793442425000-1',
    customerId: 'CUST-1001',
    customerName: 'Ranjith Kumar',
    email: 'ranjith.k@techcorp.in',
    status: 'Logged In',
    loginDate: '31 Oct 2026',
    loginTime: '11:07 AM',
    timestamp: '2026-10-31T05:37:05.000Z'
  },
  {
    id: 'c-log-1793441800000-2',
    customerId: 'CUST-1002',
    customerName: 'Aarav Deshmukh',
    email: 'aarav.d@gmail.com',
    status: 'Logged In',
    loginDate: '31 Oct 2026',
    loginTime: '09:15 AM',
    timestamp: '2026-10-31T03:45:00.000Z'
  },
  {
    id: 'c-log-1793440500000-3',
    customerId: 'CUST-1000',
    customerName: 'Test Failed User',
    email: 'failed@test.com',
    status: 'Logged Out',
    loginDate: '31 Oct 2026',
    loginTime: '08:30 AM',
    timestamp: '2026-10-31T03:00:00.000Z'
  },
  {
    id: 'c-log-1793355600000-4',
    customerId: 'CUST-1003',
    customerName: 'Meera Krishnan',
    email: 'meera.k@outlook.com',
    status: 'Logged Out',
    loginDate: '30 Oct 2026',
    loginTime: '03:40 PM',
    timestamp: '2026-10-30T10:10:00.000Z'
  },
  {
    id: 'c-log-1793347500000-5',
    customerId: 'CUST-1004',
    customerName: 'Vikram Malhotra',
    email: 'vikram.m@corp.in',
    status: 'Logged In',
    loginDate: '30 Oct 2026',
    loginTime: '01:25 PM',
    timestamp: '2026-10-30T07:55:00.000Z'
  },
  {
    id: 'c-log-1793269800000-6',
    customerId: 'CUST-1005',
    customerName: 'Pooja Hegde',
    email: 'pooja.h@yahoo.com',
    status: 'Logged Out',
    loginDate: '29 Oct 2026',
    loginTime: '05:10 PM',
    timestamp: '2026-10-29T11:40:00.000Z'
  },
  {
    id: 'c-log-1793253000000-7',
    customerId: 'CUST-1006',
    customerName: 'Rohan Verma',
    email: 'rohan.v@gmail.com',
    status: 'Logged In',
    loginDate: '29 Oct 2026',
    loginTime: '12:30 PM',
    timestamp: '2026-10-29T07:00:00.000Z'
  },
  {
    id: 'c-log-1793179200000-8',
    customerId: 'CUST-1007',
    customerName: 'Ananya Iyer',
    email: 'ananya.i@techcorp.com',
    status: 'Logged Out',
    loginDate: '28 Oct 2026',
    loginTime: '04:15 PM',
    timestamp: '2026-10-28T10:45:00.000Z'
  },
  {
    id: 'c-log-1793093400000-9',
    customerId: 'CUST-1008',
    customerName: 'Sanjay Singhania',
    email: 'sanjay.s@singhania.in',
    status: 'Logged Out',
    loginDate: '27 Oct 2026',
    loginTime: '02:50 PM',
    timestamp: '2026-10-27T09:20:00.000Z'
  },
  {
    id: 'c-log-1793006400000-10',
    customerId: 'CUST-1009',
    customerName: 'Priya Sharma',
    email: 'priya.s@retail.in',
    status: 'Logged In',
    loginDate: '26 Oct 2026',
    loginTime: '11:20 AM',
    timestamp: '2026-10-26T05:50:00.000Z'
  },
  {
    id: 'c-log-1792915500000-11',
    customerId: 'CUST-1010',
    customerName: 'Arjun Venkatesh',
    email: 'arjun.v@chennai.org',
    status: 'Logged Out',
    loginDate: '25 Oct 2026',
    loginTime: '10:05 AM',
    timestamp: '2026-10-25T04:35:00.000Z'
  },
  {
    id: 'c-log-1792860600000-12',
    customerId: 'CUST-1011',
    customerName: 'Kavita Reddy',
    email: 'kavita.r@biotech.co.in',
    status: 'Logged Out',
    loginDate: '24 Oct 2026',
    loginTime: '06:30 PM',
    timestamp: '2026-10-24T13:00:00.000Z'
  },
  {
    id: 'c-log-1792762500000-13',
    customerId: 'CUST-1012',
    customerName: 'Deepak Nambiar',
    email: 'deepak.n@enterprise.in',
    status: 'Logged In',
    loginDate: '23 Oct 2026',
    loginTime: '03:15 PM',
    timestamp: '2026-10-23T09:45:00.000Z'
  },
  {
    id: 'c-log-1792650000000-14',
    customerId: 'CUST-1013',
    customerName: 'Sneha Patil',
    email: 'sneha.p@greenclean.org',
    status: 'Logged Out',
    loginDate: '22 Oct 2026',
    loginTime: '09:50 AM',
    timestamp: '2026-10-22T04:20:00.000Z'
  }
];

db.customer_logins = initialCustomerLogins;
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('✓ Successfully populated customer_logins in whitemist_db.json with', initialCustomerLogins.length, 'records.');

