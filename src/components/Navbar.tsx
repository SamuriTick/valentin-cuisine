"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'program' | 'facility' | 'page'
  url: string
}

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [searching, setSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Perform search when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        setShowResults(false)
        return
      }

      setSearching(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        if (response.ok) {
          const results = await response.json()
          setSearchResults(results)
          setShowResults(true)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setSearching(false)
      }
    }

    const timeoutId = setTimeout(performSearch, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchResultClick = () => {
    setShowResults(false)
    setSearchQuery("")
  }

  const navigation = [
    { label: "HOME", href: "/" },
    { label: "WHAT'S ON", href: "/programs" },
    { label: "BOOK A ROOM", href: "/facilities" },
    { label: "NEWS", href: "/news" },
    { label: "ABOUT", href: "/about" },
    { label: "CONTACT", href: "/contact" },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Top bar with search */}
        <div className="hidden lg:flex justify-end py-2 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                placeholder="Search programs, facilities..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="pl-4 pr-10 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              
              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-96 overflow-y-auto">
                  {searching && (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mx-auto"></div>
                      <span className="ml-2 text-sm">Searching...</span>
                    </div>
                  )}
                  
                  {!searching && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">No results found for "{searchQuery}"</p>
                    </div>
                  )}
                  
                  {!searching && searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={result.url}
                      onClick={handleSearchResultClick}
                      className="block p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {result.type === 'program' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Program
                            </span>
                          )}
                          {result.type === 'facility' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Facility
                            </span>
                          )}
                          {result.type === 'page' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Page
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {result.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {result.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div>
              <h1 className="text-xl font-heading font-bold text-primary-600 tracking-tight">
                WEST ACTON
              </h1>
              <p className="text-sm text-gray-600 font-medium -mt-1">
                Community Centre
              </p>
            </div>
            <span className="sr-only">West Acton Community Centre</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8 items-center">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors tracking-wide"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-primary-600 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 bg-white">
            <nav className="space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors tracking-wide"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* Mobile Search */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search programs, facilities..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              
              {/* Mobile Search Results */}
              {showResults && (
                <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
                  {searching && (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mx-auto"></div>
                      <span className="ml-2 text-sm">Searching...</span>
                    </div>
                  )}
                  
                  {!searching && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">No results found for "{searchQuery}"</p>
                    </div>
                  )}
                  
                  {!searching && searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={result.url}
                      onClick={() => {
                        handleSearchResultClick()
                        setMenuOpen(false)
                      }}
                      className="block p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {result.type === 'program' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Program
                            </span>
                          )}
                          {result.type === 'facility' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Facility
                            </span>
                          )}
                          {result.type === 'page' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Page
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {result.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {result.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};