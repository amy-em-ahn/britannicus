export interface Employee {
    empId: number,
    role: Role,
    name: string,
    username: string,
    password?: string, 
}
// Perhaps a ts utility type could make an Employee login type with just username and password?

type Role = "owner" | "employee"