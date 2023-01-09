import { useContext, useEffect, useState } from "react";
import finnhub from "../APIs/finnhub";
import { WatchListContext } from "../context";

const AutoComplete = () => {

    const [search, setSearch] = useState("");
    const [results, setResults] = useState([])

    const {addStock, deleteStock} = useContext(WatchListContext)

    const renderDropDown = () => {
        const dropdownClass = search ? "show" : null
        return (
            <ul
                className={`dropdown-menu ${dropdownClass}`}
                style={{
                    height: '500px',
                    overflowY: "scroll",
                    overflowX: "hidden",
                    cursor: "pointer"
            }}>
               
                    {results.map((result) => {
                        return (
                            <li key={result.symbol} onClick={() => {
                                addStock(result.symbol)
                                setSearch("")
                            }}>
                                {result.description} {result.symbol}</li>
                        )
                    })}
                
            </ul>
        )
}

    useEffect(() => {
        let isMounted = true;
        const fetchData = async() => {
            try {
                const responses = await finnhub.get("/search", {
                    params: {
                        q: search
                    }
                })
                if (isMounted) {
                    setResults(responses.data.result)
                }
            }
            catch (err) {
                
            }
        }
        if (search.length > 0) {
            fetchData()
        } else {
            setResults([])
        }
        return () => (isMounted = false)
    }, [search])




    return (
        <div className="w-50 p-5 rounded mx-auto">
            <div className="form-floating dropdown">
                <input style={{ backgroundColor: 'rgba(145,158,171,0.04)' }} id='search' type="text" className="form-control"
                    placeholder="Search" autoComplete="off" value={search} onChange={(e) => {setSearch(e.target.value)}}
                />
                <label htmlFor="search">Search</label>

                {renderDropDown()}
            </div>
            
        </div>
    )
}

export default AutoComplete;