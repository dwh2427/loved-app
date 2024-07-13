'use client'
import ImageSkeleton from '@/components/ui/skeleton';
import useApiCaller from '@/hooks/useApiCaller';
import DummyImage from "@/public/dummy.jpg";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FindLoved() {
	const apiCaller = useApiCaller();
	const [removeText, setRemoveText] = useState(false);
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(true);
	const [pages, setPages] = useState([]);
	const router = useRouter();

	useEffect(() => {
		const fetchPages = async () => {
			setLoading(true);
			const response = await apiCaller.get('/api/api/get_pages_for_public?searchText=');
			setPages(response.data.data);
			if (response.data.data) setLoading(false);
			setLoading(false);
		};
		fetchPages();
	}, [apiCaller, removeText]);

	const handleSearch = async (event) => {
		const value = event.target.value;
		setSearch(value);
		if (value.length > 2 || value.length === 0) {
			setLoading(true);
			const response = await apiCaller.get(`/api/api/get_pages_for_public?searchText=${value}`);
			setPages(response?.data?.data);
			setLoading(false);
		}
	}

	const handleGotoPage = (pageId) => {
		router.push(`/${pageId}`);
	}

	return (
		<section className='mx-auto max-w-[1025px]'>
			<div className='mt-10 flex flex-col justify-center items-center'>
				<h3 className='text-[36px]'>Search For Your Loved Ones</h3>
				<p className='text-xs'>Find them by searching their first and last name. If they’re <br /> not already part of Loved, add them and get them set up.</p>
				<div className="mt-10 relative">
					<svg className="size-4 absolute left-4 top-[30%]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
						<path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
					</svg>
					{
						search && <svg onClick={() => { setSearch(''); setRemoveText(!removeText) }} className="size-4 absolute right-4 top-[30%]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
						</svg>
					}
					<input value={search} onChange={handleSearch} type="text" className="w-[280px] pl-9 border bg-gray-100 border-gray-300 rounded-full p-2" />
				</div>
			</div>
			<div className="mt-10">
				<div className="grid md:grid-cols-3 gap-4 sm:gird-cols-1 d-rs-justify-center">
					{
						loading ?
							Array.from({ length: 6 }).map((_, index) => (
								<ImageSkeleton key={index} />
							))
							: ''
					}
					{
						pages.map((page, index) => (
							<div key={index} className='mb-16 w-[274px] cursor-pointer' onClick={() => handleGotoPage(page?.username)}>
								<h3 className='text-center mb-2'>{page?.first_name} {page?.last_name}</h3>
								<Image className='rounded-lg' src={page?.images?.[0] || DummyImage} width={271} height={230} alt='loved images' />
							</div>
						))
					}

				</div>
				{
					!loading && pages.length === 0 && <h3 className='text-center text-2xl '>No result found</h3>
				}
			</div>
		</section>
	)
}


export const Head = {
	title: "Loved | share Your Love",
	description: "Share Your Love",
};