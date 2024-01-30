import { useEffect, useState } from "react";
import supabase from "../lib/Supabase";
import toast from "react-hot-toast";

const User = () => {
  const [originalDocumentData, setOriginalDocumentData] = useState(null);
  const [filteredDocumentData, setFilteredDocumentData] = useState(null);
  const [error, setError] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("document")
          .select("*")
          // .range((page - 1) * pageSize, page * pageSize - 1)
          .order("id", { ascending: false });

        if (error) {
          setError(error.message);
        } else {
          setOriginalDocumentData(data);
          setFilteredDocumentData(data);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
  }, [isAddModalVisible]);

  useEffect(() => {
    if (originalDocumentData) {
      const filteredData = originalDocumentData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDocumentData(filteredData);
    }
  }, [searchTerm, originalDocumentData]);

  const handleDelete = (id) => {
    setDeleteItemId(id);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from("document")
        .delete()
        .eq("id", deleteItemId);
      if (error) {
        setError(error.message);
      } else {
        const updatedData = filteredDocumentData.filter(
          (item) => item.id !== deleteItemId
        );
        setFilteredDocumentData(updatedData);
        toast.success("Dato elimanado con éxito!");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDeleteModalVisible(false);
      setDeleteItemId(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeleteItemId(null);
  };

  const handleAdd = () => {
    setIsAddModalVisible(true);
  };

  const confirmAdd = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from("document").upsert([
        {
          name: newProduct.name,
          description: newProduct.description,
        },
      ]);

      if (error) {
        setError(error.message);
      } else {
        const updatedData = [...filteredDocumentData, data[0]];
        setFilteredDocumentData(updatedData);
        toast.success("Nuevo dato agregado con éxito!");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsAddModalVisible(false);
      setNewProduct({
        name: "",
        description: "",
      });
    }
  };

  const cancelAdd = () => {
    setIsAddModalVisible(false);
    setNewProduct({
      name: "",
      description: "",
    });
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        <div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center text-white bg-slate-800 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Agregar
          </button>
          <button
            data-dropdown-toggle="dropdownRadio"
            className="inline-flex items-center text-white bg-green-500 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Exportar a excel
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className="block p-2 ps-10 text-sm text-gray-900 border focus:outline-none border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4"></th>
            <th scope="col" className="px-6 py-3">
              id
            </th>
            <th scope="col" className="px-6 py-3">
              NOmbre
            </th>
            <th scope="col" className="px-6 py-3">
              Descripción
            </th>
            <th scope="col" className="px-6 py-3">
              Fecha
            </th>
            <th scope="col" className="px-6 py-3">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredDocumentData &&
            filteredDocumentData.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="w-4 p-4"></td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {item.id}
                </th>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.description}</td>
                <td className="px-6 py-4">{item.created_at}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="font-medium ml-2 text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="font-medium ml-2 text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {isDeleteModalVisible && (
        <div
          id="deleteModal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
        >
          <div className="relative p-4 w-full max-w-md h-full items-center mt-[50vh]">
            {/* Modal content */}
            <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
              <button
                type="button"
                className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={cancelDelete}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <svg
                className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="mb-4 text-gray-500 dark:text-gray-300 font-bold text-xl">
                Estás seguro que quieres eliminar este elemento?
              </p>
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={cancelDelete}
                  type="button"
                  className="py-2 px-3 text-sm font-bold text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  No, cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  type="submit"
                  className="py-2 px-3 text-sm font-bold text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                >
                  Sí, estoy seguro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddModalVisible && (
        <div
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
        >
          <div className="relative p-4 w-full max-w-md h-full items-center mt-[50vh]">
            {/* Add Modal content */}
            <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
              <button
                type="button"
                className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={cancelAdd}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <form className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label className="block mb-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="nombre"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block mb-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                      Descripción
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="descripción"
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <button
                  onClick={confirmAdd}
                  type="button"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="me-1 -ms-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Agregar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
