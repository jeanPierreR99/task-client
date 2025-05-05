import { useEffect, useState } from "react";
import { API } from "../../../shared/js/api";
import { PrintScannerDto } from "../../../shared/js/interface";

const printScanner = () => {
    const [data, setData] = useState<PrintScannerDto[] | []>([])
    const getAllPrintScanners = async () => {
        const response = await API.getAllPrintScanners()
        if (response?.success) {
            setData(response.data)
        }

    }

    useEffect(() => {
        getAllPrintScanners()
    }, [])
    return (
        <div>
            <span className="text-sm text-gray-400">Impresoras y escanners</span>
            <br />
            <br />
            <div className="w-full overflow-x-auto">
                <table className="w-full overflow-x-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">#</th>
                            <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">Sede</th>
                            <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">Oficina</th>
                            <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">Oficina Especifica</th>
                            <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">Cód Patrimonial</th>
                            <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">Serie</th>
                            <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">Marca</th>
                            <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">Tipo</th>
                            <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">Modelo</th>
                            <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">Color</th>
                            <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">IP</th>
                            <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item: PrintScannerDto, index: number) => (
                            <tr key={item.id} className="border-t hover:bg-gray-50 transition-all">
                                <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.sedes}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.oficina}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 ">{item.oficinaEspecifica}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.codPatrimonial}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.serie}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.marca}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.tipo}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.modelo}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.color}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.ip}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.estado}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default printScanner;