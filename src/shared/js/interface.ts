//COMMENTS
export interface CreateCommentDto {
    comment: string;
    date: string;
    taskId: string;
    userId: string;
}

//TASKS
export interface CreateTaskDto {
    name: string;
    description: string;
    completed: boolean;
    created_by: string;
    status: string;
    dateCulmined: string;
    responsibleId: string;
    categoryId: string;
}
export interface UpdateTaskDto {
    name?: string;
    description?: string;
    completed?: boolean;
    created_by?: string;
    status?: string;
    dateCulmined?: string;
    responsibleId?: string;
    categoryId?: string;
}



//SUBTASKS
export interface CreateSubtaskDto {
    name: string;
    completed: boolean;
    dateCulmined: string;
    taskId: string;
    responsibleId: string;
}

export interface UpdateSubtaskDto {
    name?: string;
    completed?: boolean;
    dateCulmined?: string;
    taskId?: string;
    responsibleId?: string;
}


//FILE
export interface CreateFileDto {
    name: string;
    url: string;
    reference?: string;
    taskId?: string;
    subtaskId?: string;
}

//USER
export interface CreateUserDto {
    name: string;
    email: string;
    passwordHash: string;
    roleId: string;
}

export interface CreateRoleDto {
    name: string;
}
