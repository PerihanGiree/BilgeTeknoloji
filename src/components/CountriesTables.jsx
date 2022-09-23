import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
const CountriesTables = () => {
  const localStorageKey = "countries";
  const isReset = "false";
  const [pending, setPending] = useState(false);
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);

  const getCountries = async (isReset) => {
    try {
      setPending(true);
      const localCountriesStr = await localStorage.getItem(localStorageKey);
      const localCountries = JSON.parse(localCountriesStr);
      if (!isReset && localCountries && localCountries.length > 0) {
        setCountries(localCountries);
        setFilteredCountries(localCountries);
      } else {
        const response = await axios.get(
          "https://restcountries.com/v2/regionalbloc/eu"
        );
        setCountries(response.data);
        setFilteredCountries(response.data);

        localStorage.setItem("countries", JSON.stringify(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (countries.length > 0) setPending(false);
  }, [countries]);

  const setLocalStorage = async (key, newCountries) => {
    await localStorage.setItem(key, JSON.stringify(newCountries));
  };

  const handleDelete = async (name) => {
    const arrayCopy = countries.filter((row) => row.name !== name);
    setCountries(arrayCopy);
    setFilteredCountries(arrayCopy);
    await setLocalStorage(localStorageKey, arrayCopy);
  };

  const columns = [
    {
      name: "Ülke İsim",

      selector: ({ name }) => name,
      sortable: true,
    },
    {
      name: "ülke Milliyet İsim",
      selector: (row) => row.nativeName,
      sortable: true,
    },
    {
      name: "Ülke Başkentleri",
      selector: (row) => row.capital,
      sortable: true,
    },
    {
      name: "Ülke Bayrak",
      selector: (row) => <img width={50} height={50} src={row.flag} />,
    },
    {
      name: "Olay",
      cell: (row) => (
        <button
          className="bg-cyan-600 hover:bg-cyan-900 rounded-sm w-14 h-5 text-white"
          onClick={() => handleDelete(row.name)}
        >
          Delete
        </button>
      ),
    },
  ];

  useEffect(() => {
    getCountries(false);
  }, []);
  const CustomLoader = () => {
    <div className="p-6">
      <h1>Loading...</h1>
    </div>;
  };
  useEffect(() => {
    const result = countries.filter((country) => {
      return (
        country.name.toString().toLowerCase().match(search.toLowerCase()) ||
        (country.capital &&
          country.capital
            .toString()
            .toLowerCase()
            .match(search.toLowerCase())) ||
        (typeof country.nativeName === "string" &&
          country.nativeName.toLowerCase().match(search.toLowerCase()))
      );
    });
    setFilteredCountries(result);
  }, [search]);

  const customStyles = {
    header: {
      style: {
        color: "white",
        paddingTop: 20,
        fontSize: 24,
        fontWeight: "bold",
      },
    },
    rows: {
      style: {
        minHeight: "40px",
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
  };
  createTheme(
    "solarized",
    {
      text: {
        primary: "#268bd2",
        secondary: "#2aa198",
      },
      background: {
        default: "#002b36",
      },
      context: {
        background: "#cb4b16",
        text: "#FFFFFF",
      },
      divider: {
        default: "#073642",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.08)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "dark"
  );

  return (
    <DataTable
      title="Ülke Listesi"
      columns={columns}
      actions={
        <button
          className="w-36 h-9 bg-blue-500 rounded-sm shadow-md text-white items-center justify-center cursor-pointer m-4 text-sm"
          onClick={() => getCountries(true)}
        >
          Sıfırla
        </button>
      }
      data={filteredCountries}
      customStyles={customStyles}
      pagination
      fixedHeader
      fixedHeaderScrollHeight="500px"
      selectableRowsHighlight
      highlightOnHover
      subHeader
      subHeaderComponent={
        <input
          type="text"
          placeholder="Arama yap..."
          className=" w-25 border-2 rounded-md"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      }
      subHeaderAlign="center"
      subHeaderWrap="center"
      theme="solarized"
      progressPending={pending}
      progressComponent={<CustomLoader />}
    />
  );
};

export default CountriesTables;
