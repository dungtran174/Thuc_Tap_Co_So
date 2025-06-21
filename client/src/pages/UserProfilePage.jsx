import React, { useEffect, useState } from "react";
import { FaUserEdit, FaSave, FaKey, FaPlus, FaTrash, FaEdit, FaCheck, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../api/api';

const UserProfilePage = () => {
  const { user, isLoggedIn, token } = useAuth();
  const [profile, setProfile] = useState({
    username: "",
    first_name: "",
    last_name: "", 
    email: "",
    phone: "",
    avatar: "",
  });
  
  const [activeTab, setActiveTab] = useState('profile');
  const [editProfile, setEditProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  
  const [passwordForm, setPasswordForm] = useState({ 
    oldPassword: "", 
    newPassword: "", 
    confirmPassword: "" 
  });
  
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({ 
    id: null, 
    recipient_name: "", 
    recipient_phone: "", 
    address: "", 
    is_default: false 
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Fetch profile data khi component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      if (!token) {
        toast.error("Vui lòng đăng nhập để xem thông tin");
        return;
      }

      const response = await userAPI.getProfile();
      const userData = response.user || response;
      
      setProfile({
        username: userData.username || "",
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        avatar: userData.avatar || "",
      });

      // Fetch addresses if available
      if (userData.addresses) {
        setAddresses(userData.addresses);
      } else {
        fetchAddresses();
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await userAPI.getAddresses();
      setAddresses(response.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  // Profile handlers
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async () => {
    try {
      await userAPI.updateProfile(profile);
      setEditProfile(false);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Cập nhật thất bại!");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast.error("Vui lòng chọn ảnh");
      return;
    }
    
    try {
      const response = await userAPI.uploadAvatar(avatarFile);
      setProfile({ ...profile, avatar: response.avatar });
      setAvatarPreview("");
      setAvatarFile(null);
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Upload ảnh thất bại!");
    }
  };

  // Password handlers
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      await userAPI.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      
      toast.success("Đổi mật khẩu thành công!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại!");
    }
  };

  // Address handlers
  const openAddAddress = () => {
    setAddressForm({ 
      id: null, 
      recipient_name: "", 
      recipient_phone: "", 
      address: "", 
      is_default: false 
    });
    setIsEditingAddress(false);
    setShowAddressModal(true);
  };

  const openEditAddress = (addr) => {
    setAddressForm(addr);
    setIsEditingAddress(true);
    setShowAddressModal(true);
  };

  const handleAddressFormChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setAddressForm({ ...addressForm, [e.target.name]: value });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditingAddress) {
        await userAPI.updateAddress(addressForm.id, addressForm);
        toast.success("Cập nhật địa chỉ thành công!");
      } else {
        await userAPI.createAddress(addressForm);
        toast.success("Thêm địa chỉ thành công!");
      }
      
      setShowAddressModal(false);
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error("Lưu địa chỉ thất bại!");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa địa chỉ này?")) return;
    
    try {
      await userAPI.deleteAddress(id);
      toast.success("Xóa địa chỉ thành công!");
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error("Xóa địa chỉ thất bại!");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await userAPI.setDefaultAddress(id);
      toast.success("Đặt địa chỉ mặc định thành công!");
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error("Đặt mặc định thất bại!");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem thông tin cá nhân</p>
          <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Đăng nhập ngay
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              {profile.avatar ? (
                <img 
                  src={avatarPreview || profile.avatar} 
                  alt="Avatar" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <FaUser size={24} className="text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.first_name && profile.last_name 
                  ? `${profile.first_name} ${profile.last_name}`
                  : profile.username}
              </h1>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'profile'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'password'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Đổi mật khẩu
              </button>
              <button
                onClick={() => setActiveTab('address')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'address'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Quản lý địa chỉ
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={avatarPreview || profile.avatar || '/default-avatar.png'}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block">
                      <span className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                        Chọn ảnh mới
                      </span>
                      <input
                        type="file"
                        onChange={handleAvatarChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                    {avatarFile && (
                      <button 
                        onClick={handleAvatarUpload}
                        className="block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Cập nhật ảnh
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={profile.username}
                      onChange={handleProfileChange}
                      disabled={!editProfile}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      disabled={!editProfile}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={profile.last_name}
                      onChange={handleProfileChange}
                      disabled={!editProfile}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={profile.first_name}
                      onChange={handleProfileChange}
                      disabled={!editProfile}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      disabled={!editProfile}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  {editProfile ? (
                    <>
                      <button
                        onClick={handleProfileSave}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <FaSave />
                        <span>Lưu thay đổi</span>
                      </button>
                      <button
                        onClick={() => setEditProfile(false)}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditProfile(true)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <FaUserEdit />
                      <span>Chỉnh sửa</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FaKey />
                  <span>Đổi mật khẩu</span>
                </button>
              </form>
            )}

            {/* Address Tab */}
            {activeTab === 'address' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Địa chỉ của tôi</h3>
                  <button
                    onClick={openAddAddress}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <FaPlus />
                    <span>Thêm địa chỉ</span>
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📍</div>
                    <p className="text-gray-500">Chưa có địa chỉ nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map(addr => (
                      <div
                        key={addr.id}
                        className={`border rounded-lg p-4 ${
                          addr.is_default ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">
                              {addr.recipient_name}
                              {addr.is_default && (
                                <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <div className="text-gray-600 mt-1">{addr.recipient_phone}</div>
                            <div className="text-gray-600 mt-1">{addr.address}</div>
                          </div>
                          <div className="flex space-x-2">
                            {!addr.is_default && (
                              <button
                                onClick={() => handleSetDefault(addr.id)}
                                className="text-blue-600 hover:text-blue-800 p-2"
                                title="Đặt mặc định"
                              >
                                <FaCheck />
                              </button>
                            )}
                            <button
                              onClick={() => openEditAddress(addr)}
                              className="text-yellow-600 hover:text-yellow-800 p-2"
                              title="Sửa"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-red-600 hover:text-red-800 p-2"
                              title="Xóa"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              {isEditingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ"}
            </h4>
            
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên người nhận
                </label>
                <input
                  type="text"
                  name="recipient_name"
                  value={addressForm.recipient_name}
                  onChange={handleAddressFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="recipient_phone"
                  value={addressForm.recipient_phone}
                  onChange={handleAddressFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <textarea
                  name="address"
                  value={addressForm.address}
                  onChange={handleAddressFormChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={addressForm.is_default}
                  onChange={handleAddressFormChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Đặt làm địa chỉ mặc định</span>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isEditingAddress ? "Cập nhật" : "Thêm"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;