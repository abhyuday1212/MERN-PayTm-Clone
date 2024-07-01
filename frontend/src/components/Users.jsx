import { useEffect, useState, useRef } from "react";
import { Button } from "./Button";
import axios from "axios";
import { User } from "./User";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const debounceRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/user/bulk`,
          {
            params: {
              filter,
              page: currentPage,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.users) {
          setUsers(response.data.users);
          setTotalPages(response.data.totalPages);
        } else {
          setUsers([]);
          setTotalPages(null);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
        setTotalPages(null);
      }
    };

    // Debouncing logic
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [currentPage, filter]);

  const handleNextPage = () => {
    if (!totalPages || currentPage < totalPages) {
      // Only update page if totalPages unknown or not exceeded
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <>
      <div className="font-bold mt-6 text-lg">Your Friends</div>
      <div className="my-2">
        <input
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          type="text"
          placeholder="Search users by their username, firstName or lastName..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        />
      </div>
      <div>
        {users.length > 0 ? (
          users.map((user) => <User key={user._id} user={user} />)
        ) : (
          <div>No users found</div>
        )}
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          type="button"
          className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        >
          Previous Page
        </button>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          type="button"
          className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        >
          Next Page
        </button>
      </div>
    </>
  );
};
