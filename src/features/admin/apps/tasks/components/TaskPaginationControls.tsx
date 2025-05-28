import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../../../../../shared/components/ui/select";
import { Button } from "../../../../../shared/components/ui/button";
import useStoreTask from "../store/useStoreTask";


export const TaskPaginationControls = (
) => {
    const { totalPages, setPage, currentPage, setLimitData, limitData } = useStoreTask();


    return (
        <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex md:items-center flex-col md:flex-row gap-2 justify-between w-full">
                <div className="flex gap-2 items-center">
                    <label htmlFor="perPage" className="text-sm">Mostrar:</label>
                    <Select

                        value={limitData.toString()}
                        onValueChange={(value) => {
                            setLimitData(parseInt(value));
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[80px]" size="sm">
                            <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="8">8</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">40</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2 items-center">
                    <Button
                        variant="outline"
                        onClick={() => setPage(currentPage - 1)}
                        disabled={currentPage <= 1}
                        size="sm"
                    >
                        Atrás
                    </Button>
                    <span className="text-sm text-muted-foreground">Página {currentPage} de {totalPages}</span>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        Siguiente
                    </Button>
                </div>

            </div>

        </div>
    );
};
