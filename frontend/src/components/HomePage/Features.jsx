import React from "react";
import { MdFeaturedPlayList } from "react-icons/md";
import DetailsCard from "./DetailsCard";

const Features = () => {
	const featureheading = [
		"Accessibility",
		"Anonymity",
		"Language Translation Capability",
		"personalised care",
	];
	const features = [
		"Our solution breaks down barriers to mental health care,providing accessible support 24/7, anytime and anywhere",
		"Addressing privacy concerns and stigma associated with mental health discussions.",
		"Overcoming linguistic barriers to cater to a global audience.",
		"Allows users to choose from a variety of voices or customize the pitch, speed, and tone of the generated speech.",
	];
	const logos = [
		MdFeaturedPlayList,
		MdFeaturedPlayList,
		MdFeaturedPlayList,
		MdFeaturedPlayList,
	];
	return (
		<div className="bg-gray-200 w-full flex flex-col gap-10 pt-10 pb-10 justify-center items-center ">
			<p className="text-3xl font-bold ">Features</p>
			<div className="w-[70%] grid grid-cols-3 gap-10">
				{featureheading.map((item, index) => {
					return (
						<DetailsCard
							key={index}
							title={item}
							description={features[index]}
							logo={logos[index]}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default Features;
