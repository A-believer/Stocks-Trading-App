import { useState, useEffect, useContext } from "react";

import finnhub from "../APIs/finnhub";
import {BsFillCaretUpFill, BsFillCaretDownFill} from 'react-icons/bs'
import { WatchListContext } from "../context";
import { useNavigate } from "react-router-dom";

const StockList = () => {
    const [stocks, setStocks] = useState([])
    // const [watchList, setWatchList] = useState(['GOOGL', 'MSFT', 'AMZN']);
    const { watchList, deleteStock } = useContext(WatchListContext);
    const navigate = useNavigate()
    

    const changeColor = (change) => {
        return change > 0 ? "success" : "danger"
    }
    
    const renderIcon = (change) => {
        return change > 0 ? <BsFillCaretUpFill/> : <BsFillCaretDownFill/>
}

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            
            try {
                const responses = await Promise.all(watchList.map((stock) => {
                    return finnhub.get("/quote", {
                        params: {
                            symbol: stock
                        }
                       
                    })
                }))
                const data = responses.map((response) => {
                    return {
                        data: response.data,
                        symbol:response.config.params.symbol
                    }
                })
                if (isMounted) {
                    setStocks(data)
                }
                console.log(data)
            }
            catch (err) {
                
            }
        }
        fetchData();
        return () => (isMounted = false)
    }, [watchList])

    const handleStockSelect = (symbol) => {
        navigate(`detail/${symbol}`)
    }

    return (
        <div>
            <table className="table hover mt-5">
                <thead style={{ color: 'rgb(79,89,102)' }}>
                    <tr>
                        <th className="col">Name</th>
                        <th className="col">Last</th>
                        <th className="col">Chg</th>
                        <th className="col">Chg%</th>
                        <th className="col">High</th>
                        <th className="col">Low</th>
                        <th className="col">Open</th>
                        <th className="col">Pclose</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock) => {
                        return (
                         <tr onClick={() => handleStockSelect(stock.symbol)} style={{ cursor: "pointer" }} className="table-row" key={stock.symbol} >
                                <th scope="row">{stock.symbol}</th>
                                <td>{ stock.data.c}</td>
                                <td className={`text-${changeColor(stock.data.d)}`}>{ stock.data.d}{renderIcon(stock.data.d)}</td>
                                <td className={`text-${changeColor(stock.data.d)}`}>{ stock.data.dp}{renderIcon(stock.data.d)}</td>
                                <td>{stock.data.h}
                                </td>
                                <td>{ stock.data.l}</td>
                                <td>{ stock.data.o}</td>
                                <td>{ stock.data.pc}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        deleteStock(stock.symbol)
                                    }}
                                        style={{ marginLeft: "20px" }}
                                        className="btn btn-danger btn-sm ml-3 d-inline-block delete-button">
                                    Remove
                                    </button></td>
                            </tr>
                        )
                    })}   
                        
                        
                </tbody>
            </table>
        </div>
    )
}

export default StockList;