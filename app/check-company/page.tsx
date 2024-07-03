// "use client";

// import { useSession, signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import axios from "axios";

// const CheckCompany = () => {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [companyStatus, setCompanyStatus] = useState(null);

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/login");
//     } else if (status === "authenticated") {
//       // Replace this with your actual API call to check the company status
//       axios.get('/api/company/status').then(response => {
//         setCompanyStatus(response.data);
//       });
//     }
//   }, [status, router]);

//   if (status === "loading") {
//     return <p>Loading...</p>;
//   }

//   if (status === "unauthenticated") {
//     return null;
//   }

//   return (
//     <div>
//       <h1>Check Company Status</h1>
//       {companyStatus ? (
//         <div>
//           <p>Company Name: {companyStatus.name}</p>
//           <p>Status: {companyStatus.status}</p>
//         </div>
//       ) : (
//         <p>Loading company status...</p>
//       )}
//     </div>
//   );
// };

// export default CheckCompany;
