import { useEffect, useState } from 'react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { FolderKanban, Users2 } from 'lucide-react';
import { getStorage } from '../../../../shared/js/functions';

const Project = () => {
    const [project, setProject] = useState({ id: "", name: "", description: "" });

    useEffect(() => {
        const projectStorage = getStorage()
        setProject(projectStorage.project)
    }, [])

    return (
        <div>
            <span className='text-sm text-gray-400'>Mis Proyectos</span>
            <br />
            <br />
            <div className='grid md:grid-cols-3 grid-cols-1'>
                <Card className='cursor-pointer'>
                    <CardHeader>
                        <CardTitle className='flex gap-2 items-center'>
                            <FolderKanban className='text-yellow-500'>
                            </FolderKanban> {project.name}
                        </CardTitle>
                    </CardHeader>
                    <CardDescription className='px-7'>{project.description}</CardDescription>
                    <CardFooter className='flex justify-end gap-2 text-gray-400'>
                        <Users2></Users2> 4 Personas
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Project;
