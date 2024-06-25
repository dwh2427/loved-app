"use client";
import React, { useState } from 'react';

const suggestions = [
	"Apple",
	"Banana",
	"Cherry",
	"Date",
	"Fig",
	"Grape",
	"Kiwi"
];

const AutocompleteInput = () => {
	const [inputValue, setInputValue] = useState('');
	const [filteredSuggestions, setFilteredSuggestions] = useState([]);

	const handleChange = (e) => {
		const value = e.target.value;
		setInputValue(value);
		if (value) {
			const filtered = suggestions.filter((suggestion) =>
				suggestion.toLowerCase().includes(value.toLowerCase())
			);
			setFilteredSuggestions(filtered);
		} else {
			setFilteredSuggestions([]);
		}
	};

	const handleClick = (suggestion) => {
		setInputValue(suggestion);
		setFilteredSuggestions([]);
	};

	return (
		<div className="relative w-64 mx-auto">
			<input
				type="text"
				value={inputValue}
				onChange={handleChange}
				className="w-full px-4 py-2 border border-gray-300 rounded"
				placeholder="Search..."
			/>
			{filteredSuggestions.length > 0 && (
				<ul className="absolute z-50 left-0 right-0 bg-white border border-gray-300 rounded mt-1">
					{filteredSuggestions.map((suggestion, index) => (
						<li
							key={index}
							onClick={() => handleClick(suggestion)}
							className="px-4 py-2 cursor-pointer hover:bg-gray-200"
						>
							{suggestion}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default AutocompleteInput;
