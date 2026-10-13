import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/button";
import AppModal from "../../components/AppModal";
import { Input } from "@/components/ui/input";
import api from "@/services/api.js";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

const ListUser = () => {
  const _initForm = {
    id: null,
    name: "",
    email: "",
    password: "",
    is_active: "1", // Ubah default jadi string/number status
  };

  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]); // Pastikan inisialisasi array kosong []
  const [formData, setFormData] = useState(_initForm);
  const [isEdit, setIsEdit] = useState(false);

  // Bagian untuk data user dengan API
  const fetchUser = async () => {
    try {
      const response = await api.get("/user");
      setUsers(response.data.data || response.data || []);
    } catch (error) {
      console.log(error.message);
    }

  };
  useEffect(() => {
    fetchUser();
  }, []);



  const handleOpenModal = () => {
    setShowModal(true);
    setFormData(_initForm);
    setIsEdit(false);
  };

  const handleEditModal = (user) => {
    setShowModal(true);
    setIsEdit(true);
    setFormData({
      ...user,
      is_active: user.is_active !== undefined ? String(user.is_active) : "1", // 
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      is_active: parseInt(formData.is_active),
    };

    try {
      if (isEdit) {
        await api.put(`/user/${formData.id}`, payload);
      } else {
        await api.post("/user", payload);
      }
      setFormData(_initForm);
      setShowModal(false);
      fetchUser(); // Ambil ulang data terbaru setelah submit
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmation = window.confirm("Are you sure want to delete this data?");
    if (confirmation) {
      try {
        await api.delete(`/user/${id}`);
        fetchUser();
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <>
      <Card className="shadow-sm border-border p-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-bold">Data user</CardTitle>
          </div>
          <Button onClick={handleOpenModal}>
            Create New User
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-y bg-muted/30 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">#</th>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* Gunakan optional chaining (?.) untuk keamanan ekstra */}
              {users && users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id || index} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`border rounded-sm px-2 py-1 text-white text-xs ${user.is_active === 1 ? "bg-green-700" : "bg-red-700"}`}>
                        {user.is_active === 1 ? "Active" : "Non-Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Button onClick={() => handleEditModal(user)} variant="default" size="sm" className="me-2">
                        Edit
                      </Button>
                      <Button onClick={() => handleDelete(user.id)} variant="destructive" size="sm">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted-foreground">
                    Belum ada data user
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <AppModal
        show={showModal}
        onClose={handleCloseModal}
        title={isEdit ? "Edit User" : "Create New User"}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? "Save Change" : "Save"}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>name</Label>
            <Input id="name" name="name" required placeholder="masukan name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input id="email" name="email" type="email" required placeholder="masukan email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input id="password" name="password" type="password" required={isEdit ? false : true} placeholder="masukan password" value={formData.password} onChange={handleChange} />
          </div>
          {isEdit ? (
            <div className="space-y-2">
              <Label>Status</Label>
              <select name="is_active" id="is_active" value={formData.is_active}
                onChange={handleChange}>
                <option value="1">Active</option>
                <option value="0">No-Active</option>
              </select>

              {/* <NativeSelect id="is_active" name="is_active" value={formData.is_active} onChange={handleChange}>
                <NativeSelectOption value="">Select status</NativeSelectOption>
                <NativeSelectOption value="1">Active </NativeSelectOption>
                <NativeSelectOption value="0">Non-Active</NativeSelectOption>
              </NativeSelect> */}
            </div>
          ) : (
            ""
          )}

        </div>
      </AppModal>
    </>
  );
};

export default ListUser;