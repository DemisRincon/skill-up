'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
    id: string;
    email: string;
    full_name?: string;
}

interface UserAutocompleteProps {
    selectedUsers: User[];
    setSelectedUsers: (users: User[]) => void;
    label?: string;
    placeholder?: string;
    multiple?: boolean;
}

export function UserAutocomplete({
    selectedUsers,
    setSelectedUsers,
    label = 'Select user',
    placeholder = 'Type to search users...',
    multiple = true,
}: UserAutocompleteProps) {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, email, full_name')
                    .order('full_name', { ascending: true });

                if (error) throw error;
                setUsers(data || []);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesQuery =
            user.email.toLowerCase().includes(query.toLowerCase()) ||
            (user.full_name && user.full_name.toLowerCase().includes(query.toLowerCase()));
        const notSelected = !selectedUsers.some(selected => selected.id === user.id);
        return matchesQuery && notSelected;
    });

    const handleSelect = (user: User) => {
        if (multiple) {
            setSelectedUsers([...selectedUsers, user]);
        } else {
            setSelectedUsers([user]);
        }
        setQuery('');
        setShowDropdown(false);
        inputRef.current?.focus();
    };

    const handleRemove = (userId: string) => {
        setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
    };

    return (
        <div className="mb-4">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={placeholder}
                    value={query}
                    onChange={e => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                />
                {showDropdown && (
                    <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {loading ? (
                            <li className="px-4 py-2 text-gray-500">Loading users...</li>
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <li
                                    key={user.id}
                                    className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
                                    onMouseDown={() => handleSelect(user)}
                                >
                                    <span className="font-medium">{user.full_name || user.email}</span>
                                    <span className="text-xs text-gray-500 ml-2">{user.email}</span>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500">No users found</li>
                        )}
                    </ul>
                )}
            </div>
            {selectedUsers.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {selectedUsers.map(user => (
                        <span key={user.id} className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">
                            {user.full_name || user.email}
                            <button
                                type="button"
                                className="ml-1 text-indigo-500 hover:text-red-500"
                                onClick={() => handleRemove(user.id)}
                                aria-label="Remove user"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
} 