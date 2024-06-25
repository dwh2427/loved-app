'use client'
import Image from 'next/image'
import Link from 'next/link'
import loveLogoMain from '@/public/loved-logo-color.svg';
import crossIcon from '@/public/crossIcon.svg';
import { useRouter } from 'next/navigation';

export default function LovedBoxHeader({ pageLink }) {
	const router = useRouter();

	return (
		<header className="flex h-24 items-center xl:h-[126px] w-full px-10">
			<div className="max-w-[1495px] mx-auto flex h-[74px] items-center justify-between w-full">

				<Link href="/" className="flex gap-1">
					<Image width={45} height={45} src={loveLogoMain} alt="loved" />
				</Link>

				<Image onClick={() => { pageLink ? router.push(`/${pageLink}`) : router.back() }} width={38} height={38} src={crossIcon} alt="loved" className="size-6 cursor-pointer" />
			</div>
		</header>
	)
}
