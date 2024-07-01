import { useState,useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";

export const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [userBalance, setUserBalance] = useState(0);
  useEffect(() => {
    async function getBalance() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/account/balance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserBalance(response.data.balance);
      } catch (error) {
        console.log("Error while getting balance response", error);
      }
    }

    getBalance();
  }, [userBalance]);

  return (
    <div>
      <Appbar />
      <div className="m-8">
        <Balance value={userBalance} />
        <Users />
      </div>
    </div>
  );
};
