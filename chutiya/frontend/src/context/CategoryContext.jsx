import { createContext, useContext } from 'react';

const CategoryContext = createContext(null);

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategory must be used within CategoryProvider');
    }
    return context;
};

export default CategoryContext;
