import Image from "next/image";

export default function Location() {
  return (
    <div className="flex flex-col gap-2 p-4 desktop:flex-row">
      <div className="relative flex w-[100%] items-center justify-center">
        <Image
          src="https://ksapkpyzblzmnusrhtxk.supabase.co/storage/v1/object/public/ASSETS/location-1.jpg"
          alt={"Image of the Cafe"}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "500px", objectFit: "cover", opacity: "40%" }}
          className="rounded-lg"
        />
        <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center rounded-lg bg-black bg-opacity-50 p-4">
          <h1 className="text-center text-h1 text-peach drop-shadow-lg">The Brown Bean Coffee</h1>
          <h2 className="text-center text-h5 text-peach drop-shadow-lg">
            No 104, Srimath Anagarika Dharmapala Mawatha, Colombo 00700, Sri Lanka
          </h2>
        </div>
      </div>
      <div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7921.62100110957!2d79.8482908935791!3d6.913247300000011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259f0cf5ade29%3A0xe4d31e972f96dec7!2sThe%20Brown%20Bean!5e0!3m2!1sen!2slk!4v1690604112760!5m2!1sen!2slk"
          className="h-[500px] w-[100%] rounded-2xl border-4 border-teak tablet:w-[600px]"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
