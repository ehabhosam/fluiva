interface LogoProps {
    white?: boolean;
    black?: boolean;
}

export default function Logo({ white = false, black = false }: LogoProps) {
    return (
        <img
            src="/assets/logo.png"
            width="100%"
            height="100%"
            alt="Fluiva Logo"
            style={
                white
                    ? {
                          filter: "brightness(0) invert(1)",
                      }
                    : black
                      ? {
                            filter: "brightness(0) invert(0)",
                        }
                      : {}
            }
        />
    );
}
