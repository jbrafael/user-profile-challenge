import React, { useEffect, useMemo, useState } from "react";
import { Edit3, MapPin, User as UserIcon, FileText, Image as ImageIcon, Link, Upload, Loader2 } from "lucide-react";
import UserPlaceholder from "../assets/profile.png";
import "./UserProfile.css";

const API_URL = "http://localhost:3000/api/user";

const initialUser = {
  full_name: "Nome Sobrenome",
  age: "30",
  street: "Rua Exemplo, 123",
  neighborhood: "Bairro Central",
  state: "SP",
  bio: "Desenvolvedor(a) entusiasmado(a) por tecnologia e inovação.",
  profile_image_url: UserPlaceholder,
};

function UserProfile() {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(API_URL, { method: "GET" });
        if (!res.ok) {
          if (res.status === 404) {
            setUser(initialUser);
            setMessage(
              <div className="message message-warning">
                <strong>Aviso!</strong>
                <span>Nenhum perfil encontrado. Crie o seu abaixo</span>
                <span className="pulse"> 👇</span>
              </div>
            );
            setIsEditing(true);
          } else {
            throw new Error(`HTTP ${res.status}`);
          }
        } else {
          const data = await res.json();
          setUser({
            full_name: data.full_name ?? "",
            age: data.age ?? "",
            street: data.street ?? "",
            neighborhood: data.neighborhood ?? "",
            state: data.state ?? "",
            bio: data.bio ?? "",
            profile_image_url: data.profile_image_url || UserPlaceholder,
          });
          setMessage("Perfil carregado com sucesso!");
        }
      } catch (e) {
        console.error(e);
        setError("Não foi possível carregar o perfil. Verifique o servidor.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fieldErrors = useMemo(() => {
    const errs = {};
    if (!user.full_name.trim()) errs.full_name = "Informe o nome completo.";
    if (user.age !== "" && Number(user.age) < 0) errs.age = "Idade não pode ser negativa.";
    if (user.state && user.state.length !== 2)
      errs.state = "Use a sigla do estado (ex.: PE, SP).";
    if (!profileImageFile && user.profile_image_url && !/^https?:\/\/|^data:image|^\/|^\./i.test(user.profile_image_url) && user.profile_image_url.trim() !== "") {
      errs.profile_image_url = "Informe uma URL válida ou deixe em branco.";
    }
    return errs;
  }, [user, profileImageFile]);

  const isValid = Object.keys(fieldErrors).length === 0;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_image_file" && files && files.length > 0) {
      setProfileImageFile(files[0]);
    } else {
      setUser((prev) => ({ ...prev, [name]: value }));
      if (name === "profile_image_url" && value !== "") {
        setProfileImageFile(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!isValid) {
      setError("Corrija os campos destacados.");
      return;
    }

    setSaving(true);
    try {
      if (profileImageFile) {
        console.log("Upload de arquivo local detectado:", profileImageFile.name);
      }

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      const data = await res.json().catch(() => ({}));
      setMessage(data.message || "Perfil salvo com sucesso!");
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      setError(e.message || "Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const profileImageUrl = useMemo(() => {
    if (profileImageFile) {
      return URL.createObjectURL(profileImageFile);
    }
    return user.profile_image_url;
  }, [user.profile_image_url, profileImageFile]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="skeleton-card">
          <div className="skeleton-title" />
          <div className="skeleton-avatar" />
          <div className="skeleton-form">
            <div className="skeleton-input-group">
              <div className="skeleton-label" />
              <div className="skeleton-input" />
            </div>
            <div className="skeleton-grid-2">
              <div className="skeleton-input-group">
                <div className="skeleton-label" />
                <div className="skeleton-input" />
              </div>
              <div className="skeleton-input-group">
                <div className="skeleton-label" />
                <div className="skeleton-input" />
              </div>
            </div>
            <div className="skeleton-grid-3">
              <div className="skeleton-input-group skeleton-span-2">
                <div className="skeleton-label" />
                <div className="skeleton-input" />
              </div>
              <div className="skeleton-input-group">
                <div className="skeleton-label" />
                <div className="skeleton-input" />
              </div>
            </div>
            <div className="skeleton-input-group">
              <div className="skeleton-label" />
              <div className="skeleton-textarea" />
            </div>
            <div className="skeleton-input-group">
              <div className="skeleton-label" />
              <div className="skeleton-input" />
            </div>
            <div className="skeleton-actions">
              <div className="skeleton-button" />
              <div className="skeleton-button" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">Meu Perfil</h1>

        {message && typeof message !== 'string' ? (
          message
        ) : (
          message && (
            <div className="message message-success">
              {message}
            </div>
          )
        )}
        {error && (
          <div className="message message-error">
            {error}
          </div>
        )}

        <div className="profile-avatar-wrapper">
          <div className="profile-image-container">
            <img
              src={profileImageUrl || UserPlaceholder}
              alt="Foto de perfil"
              className="profile-image"
            />
            {isEditing && (
              <div className="image-icon-overlay">
                <ImageIcon size={18} />
              </div>
            )}
          </div>
          {!isEditing && (
            <>
              <h2 className="view-title">
                {user.full_name || "Nome não informado"}
              </h2>
              <button
                onClick={() => setIsEditing(true)}
                className="edit-button"
              >
                <Edit3 size={18} /> Editar Perfil
              </button>
            </>
          )}
        </div>

        <div className="profile-info">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div>
                <label htmlFor="full_name" className="form-label">Nome Completo</label>
                <input
                  name="full_name"
                  value={user.full_name}
                  onChange={handleChange}
                  className={`form-input ${fieldErrors.full_name ? "form-input-error" : ""}`}
                  placeholder="Seu nome"
                  required
                />
                {fieldErrors.full_name && (
                  <p className="form-error-message">{fieldErrors.full_name}</p>
                )}
              </div>

              <div className="form-grid-2">
                <div>
                  <label className="form-label">Idade</label>
                  <input
                    type="number"
                    name="age"
                    value={user.age}
                    onChange={handleChange}
                    className={`form-input ${fieldErrors.age ? "form-input-error" : ""}`}
                    placeholder="19"
                    min={0}
                  />
                  {fieldErrors.age && (
                    <p className="form-error-message">{fieldErrors.age}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Estado (UF)</label>
                  <input
                    name="state"
                    value={user.state}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "state", value: e.target.value.toUpperCase() },
                      })
                    }
                    className={`form-input form-input-uppercase ${fieldErrors.state ? "form-input-error" : ""}`}
                    placeholder="PE"
                    maxLength={2}
                  />
                  {fieldErrors.state && (
                    <p className="form-error-message">{fieldErrors.state}</p>
                  )}
                </div>
              </div>

              <div className="form-grid-3">
                <div className="span-2">
                  <label className="form-label">Rua</label>
                  <input
                    name="street"
                    value={user.street}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Rua Exemplo, 123"
                  />
                </div>
                <div>
                  <label className="form-label">Bairro</label>
                  <input
                    name="neighborhood"
                    value={user.neighborhood}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Centro"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Biografia</label>
                <textarea
                  name="bio"
                  value={user.bio}
                  onChange={handleChange}
                  rows={4}
                  className="form-input"
                  placeholder="Conte um pouco sobre você…"
                />
              </div>

              <div className="form-image-upload">
                <div className="upload-options">
                  <label htmlFor="profile_image_file" className="upload-button">
                    <Upload size={16} /> Fazer upload
                  </label>
                  <input
                    id="profile_image_file"
                    type="file"
                    name="profile_image_file"
                    onChange={handleChange}
                  />
                  <label className="upload-separator">ou</label>
                  <div className="form-input-wrapper">
                    <Link size={16} className="form-input-icon" />
                    <input
                      type="text"
                      name="profile_image_url"
                      value={user.profile_image_url}
                      onChange={handleChange}
                      className={`form-input ${fieldErrors.profile_image_url ? "form-input-error" : ""}`}
                      placeholder="Cole a URL da imagem aqui"
                    />
                  </div>
                </div>
                {fieldErrors.profile_image_url && (
                  <p className="form-error-message">
                    {fieldErrors.profile_image_url}
                  </p>
                )}
                {profileImageFile && (
                  <p className="upload-info">Arquivo selecionado: {profileImageFile.name}</p>
                )}
              </div>

              <div className="form-actions">
                <button
                  disabled={saving}
                  type="submit"
                  className="button button-save"
                >
                  {saving ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" /> Salvando...
                    </div>
                  ) : (
                    "Salvar"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setError("");
                    setMessage("");
                    setProfileImageFile(null);
                  }}
                  className="button button-cancel"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="view-mode">
              <p className="view-detail">
                <UserIcon size={18} className="view-icon" />
                <span className="view-detail-label">Idade:</span>{" "}
                {user.age || "Não informado"}
              </p>

              <p className="view-detail">
                <MapPin size={18} className="view-icon" />
                <span className="view-detail-label">Endereço:</span>{" "}
                {[user.street, user.neighborhood, user.state].filter(Boolean).join(", ") ||
                  "Não informado"}
              </p>

              <p className="view-detail">
                <FileText size={18} className="view-icon" />
                <span className="view-detail-label">Bio:</span>{" "}
                <span className="view-bio-text">
                  {user.bio || "Nenhuma biografia disponível."}
                </span>
              </p>
            </div>
          )}
        </div>

        <p className="footer-text">
          Desafio — Perfil de Usuário • React + CSS
        </p>
      </div>
    </div>
  );
}

export default UserProfile;