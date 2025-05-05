import { useEffect, useState } from "react";
import { API } from "../../../shared/js/api";
import { PrintScannerDto } from "../../../shared/js/interface";

const ITEMS_PER_PAGE = 10;

const PrintScanner = () => {
    const [data, setData] = useState<PrintScannerDto[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const getAllPrintScanners = async () => {
        const response = await API.getAllPrintScanners();
        if (response?.success) {
            setData(response.data);
        }
    };

    useEffect(() => {
        getAllPrintScanners();
    }, []);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = data.slice(startIndex, endIndex);

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

    return (
        <div>
            <span className="text-sm text-gray-400">Impresoras y escanners</span>
            <br />
            <br />
            <div className="w-full overflow-x-auto">
                <table className="w-full overflow-x-hidden border">
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
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr key={item.id} className="border-t hover:bg-gray-50 transition-all">
                                <td className="px-6 py-4 text-sm text-gray-700">{startIndex + index + 1}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.sedes}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.oficina}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.oficinaEspecifica}</td>
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

            <div className="flex justify-center gap-4 items-center mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 bg-orange-500 text-white hover:bg-orange-400 rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                <span className="text-sm text-gray-700">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 bg-orange-500 hover:bg-orange-400 text-white rounded disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default PrintScanner;
