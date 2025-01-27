import Link from "next/link";
import { Button } from "../ui/button";

function GoogleButton() {
  return (
    <Button asChild>
      <Link href={"/api/auth/google"} prefetch={false}></Link>
    </Button>
  );
}

export { GoogleButton };
