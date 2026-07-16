import React, { useEffect, useState } from "react";
import type { Department } from "../../types/department";
import { getDepartments } from "../../api/department.api";

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [editTarget, setEditTarget] = useState<Department | null>(null);
  const [error, setError] = useState("");

  const initialForm = {
    deptCode: "",
    deptName: "",
    description: "",
    sortOrder: 0,
    parentId: null as number | null,
    useYn: "Y",
  };
  const [form, setForm] = useState(initialForm);

  // 조회
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch {
      setError("부서목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);
  return <div>DepartmentPage</div>;
}
