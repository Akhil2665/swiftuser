import React, { useState, useEffect, useMemo, use } from "react";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import Navbar from "../Navbar";

const setUserPreferences = (preferences) => {
  localStorage.setItem("userPref", JSON.stringify(preferences));
};

const getUserPreferences = () => {
  const user = localStorage.getItem("userPref");

  return user
    ? JSON.parse(user)
    : {
        page: 1,
        pageSize: 10,
        search: "",
        sortKey: null,
        sortDirection: null,
      };
};

const CommentsDashboard = () => {
  const userPreferences = getUserPreferences();
  // console.log("User Preferences fn:", userPreferences);
  const [userSettings, setUserSettings] = useState(userPreferences);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(userSettings.page || 1);
  const [pageSize, setPageSize] = useState(userSettings.pageSize || 10);
  const [searchTerm, setSearchTerm] = useState(userSettings.search || "");
  const [sortConfig, setSortConfig] = useState({
    key: userSettings.sortKey || null,
    direction: userSettings.sortDirection || null,
  });

  // Initialize state from URL parameters

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page")) || 1;
    const size = parseInt(urlParams.get("pageSize")) || 10;
    const search = urlParams.get("search") || "";
    const sortKey = urlParams.get("sortKey") || null;
    const sortDirection = urlParams.get("sortDirection") || null;

    setCurrentPage(page);
    setPageSize(size);
    setSearchTerm(search);
    setSortConfig({ key: sortKey, direction: sortDirection });
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage !== 1) params.set("page", currentPage.toString());
    if (pageSize !== 10) params.set("pageSize", pageSize.toString());
    if (searchTerm) params.set("search", searchTerm);
    if (sortConfig.key) params.set("sortKey", sortConfig.key);
    if (sortConfig.direction) params.set("sortDirection", sortConfig.direction);

    const newUrl = `${window.location.pathname}${
      params.toString() ? "?" + params.toString() : ""
    }`;
    window.history.replaceState({}, "", newUrl);
  }, [currentPage, pageSize, searchTerm, sortConfig]);

  // Fetch comments data
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/comments"
        );
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  useEffect(() => {
    setUserPreferences({
      page: currentPage,
      pageSize,
      search: searchTerm,
      sortKey: sortConfig.key,
      sortDirection: sortConfig.direction,
    });

    setUserSettings({
      page: currentPage,
      pageSize,
      search: searchTerm,
      sortKey: sortConfig.key,
      sortDirection: sortConfig.direction,
    });
  }, [currentPage, pageSize, searchTerm, sortConfig]);

  const filteredAndSortedComments = useMemo(() => {
    let filtered = comments.filter((comment) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        comment.name.toLowerCase().includes(searchLower) ||
        comment.email.toLowerCase().includes(searchLower) ||
        comment.id.toString().includes(searchLower)
      );
    });

    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "postId" || sortConfig.key === "id") {
          aValue = parseInt(aValue);
          bValue = parseInt(bValue);
        } else {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [comments, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedComments.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentComments = filteredAndSortedComments.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key !== key) {
        return { key, direction: "asc" };
      }

      if (prevConfig.direction === null) {
        return { key, direction: "asc" };
      } else if (prevConfig.direction === "asc") {
        return { key, direction: "desc" };
      } else {
        return { key: null, direction: null };
      }
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    if (sortConfig.direction === "asc")
      return <ChevronUp className="w-4 h-4" />;
    if (sortConfig.direction === "desc")
      return <ChevronDown className="w-4 h-4" />;
    return null;
  };

  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
        {/* Search and Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2 sort-buttons-container">
            <button
              onClick={() => handleSort("postId")}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                sortConfig.key === "postId"
                  ? sortConfig.direction === "asc"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-200 text-gray-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Post ID {getSortIcon("postId")}
            </button>
            <button
              onClick={() => handleSort("name")}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                sortConfig.key === "name"
                  ? sortConfig.direction === "asc"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-200 text-gray-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Name {getSortIcon("name")}
            </button>
            <button
              onClick={() => handleSort("email")}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                sortConfig.key === "email"
                  ? sortConfig.direction === "asc"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-600 text-gray-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Email <span>{getSortIcon("email")}</span>
            </button>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none">
                    <div className="flex items-center space-x-1">
                      <span>Post ID</span>
                      {getSortIcon("postId")}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none">
                    <div className="flex items-center space-x-1">
                      <span>Name</span>
                      {getSortIcon("name")}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none">
                    <div className="flex items-center space-x-1">
                      <span>Email</span>
                      {getSortIcon("email")}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentComments.map((comment) => (
                  <tr key={comment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {comment.postId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {comment.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {comment.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                      <div
                        className="truncate md:text-clip"
                        title={comment.body}
                      >
                        {comment.body}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentComments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No comments found matching your search criteria.
              </p>
            </div>
          )}
        </div>
        <div className="mb-4 text-sm text-gray-600">
          Showing {Math.min(startIndex + 1, filteredAndSortedComments.length)}{" "}
          to {Math.min(endIndex, filteredAndSortedComments.length)} of{" "}
          {filteredAndSortedComments.length} results
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Show:</label>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-600">per page</span>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {`<`}
              </button>

              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof page === "number" && handlePageChange(page)
                  }
                  disabled={page === "..."}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    page === currentPage
                      ? "bg-blue-600 text-white border-blue-600"
                      : page === "..."
                      ? "border-transparent cursor-default"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {`>`}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CommentsDashboard;
