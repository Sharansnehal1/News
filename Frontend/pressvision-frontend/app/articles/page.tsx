import Link from "next/link";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  content: { children: { text: string }[] }[];
  image?: { url: string }[];
  createdAt: string;
}

interface Props {
  articles: Article[];
}

const Features: React.FC<Props> = ({ articles }) => {
  return (
    <div className="container-fluid features mb-5">
      <div className="container py-5">
        <div className="row g-4">
          {articles.map((article) => (
            <div key={article.id} className="col-md-6 col-lg-6 col-xl-3">
              <div className="row g-4 align-items-center features-item">

                {/* IMAGE */}
                <div className="col-4">
                  <div className="rounded-circle position-relative overflow-hidden">
                    {article.image?.[0]?.url ? (
                      <Image
                        src={`http://localhost:1337${article.image[0].url}`}
                        alt={article.title}
                        width={150} // adjust as needed
                        height={150} // adjust as needed
                        className="img-zoomin rounded-circle w-100"
                      />
                    ) : (
                      <img
                        src="https://via.placeholder.com/150"
                        className="img-zoomin img-fluid rounded-circle w-100"
                        alt=""
                      />
                    )}
                    <span
                      className="rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute"
                      style={{ top: "10%", right: "-10px" }}
                    >
                      3
                    </span>
                  </div>
                </div>

                {/* TEXT */}
                <div className="col-8">
                  <div className="features-content d-flex flex-column">
                    <p className="text-uppercase mb-2">{article.title}</p>

                    <Link href={`/articlesdetails/${article.id}`} className="h6">
                      {article.content
                        .map((b) => b.children?.map((c) => c.text).join(" "))
                        .join(" ")}
                    </Link>

                    <small className="text-body d-block">
                      <i className="fas fa-calendar-alt me-1"></i>
                      {article.createdAt}
                    </small>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
