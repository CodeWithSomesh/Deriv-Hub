import { InstaIcon, XSocialIcon, TiktokIcon, YoutubeIcon } from './Icons'

export const Footer = () => {
  return (
    <footer className="bg-black text-white/60 py-5 border-t border-white/20">
      <div className="container">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="text-center">© 2024 MeshSaaS, Inc. All Rights Reserved</div>
          
          <ul className="flex justify-center gap-2.5">
            <li><XSocialIcon /></li>
            <li><InstaIcon /></li>
            <li><TiktokIcon /></li>
            <li><YoutubeIcon /></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
