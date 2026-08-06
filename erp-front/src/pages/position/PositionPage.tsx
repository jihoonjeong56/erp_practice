import { useEffect, useState } from "react";
import type { Position } from "../../types/employee";
import { getPositions } from "../../api/employee.api";
import { createPosition, updatePosition } from "../../api/position.api";

export default function PositionPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Position | null>(null);
  const [error, setError] = useState("");

  const initialForm = { posCode: "", posName: "", level: 1, useYn: "Y" };
  const [form, setForm] = useState(initialForm);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      setPositions(await getPositions());
    } catch {
      setError("직급 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEdit = (pos: Position) => {
    setEditTarget(pos);
    setForm({
      posCode: pos.posCode,
      posName: pos.posName,
      level: pos.level,
      useYn: pos.useYn,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setError("");
    try {
      if (editTarget) {
        await updatePosition(editTarget.id, {
          posName: form.posName,
          level: form.level,
          useYn: form.useYn,
        });
      } else {
        await createPosition({
          posCode: form.posCode,
          posName: form.posName,
          level: form.level,
        });
      }
      setShowModal(false);
      fetchPositions();
    } catch (err: any) {
      setError(err.response?.data?.message || "저장에 실패했습니다.");
    }
  };

  const handleDelete = async(id: number)=> {
    
  }

  return <div>PositionPage</div>;
}
