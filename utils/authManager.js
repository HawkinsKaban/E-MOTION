import AsyncStorage from '@react-native-async-storage/async-storage';

// Fungsi untuk logout - dapat digunakan di mana saja
export const logout = async () => {
  try {
    // Hapus semua data pengguna 
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('username');
    
    // Anda juga bisa menambahkan kode untuk menghapus data lain yang disimpan selama sesi login
    
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
};

// Fungsi untuk memeriksa status login
export const isLoggedIn = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token !== null;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};