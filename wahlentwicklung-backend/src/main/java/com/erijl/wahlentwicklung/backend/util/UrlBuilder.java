package com.erijl.wahlentwicklung.backend.util;

public class UrlBuilder {

    private final StringBuilder url;

    public UrlBuilder(String baseUrl) {
        url = new StringBuilder().append(baseUrl);
    }

    public FromBuilder from(String table) {
        url.append("/rest/v1/").append(table);
        return new FromBuilder();
    }

    public RpcBuilder rpc(String procedure) {
        url.append("/rest/v1/rpc/").append(procedure);
        return new RpcBuilder();
    }

    public class FromBuilder {

        public SelectBuilder select(String... columns) {
            url.append("?select=");
            if (columns.length == 1 && columns[0].equals("*")) {
                url.append("*");
            } else {
                for (String column : columns) {
                    url.append(column);
                    url.append(",");
                }
                url.deleteCharAt(url.length() - 1);
            }
            return new SelectBuilder();
        }

        public String getUrl() {
            return url.toString();
        }
    }

    public class SelectBuilder {

        public SelectBuilder eq(String column, String value) {
            url.append("&").append(column).append("=eq.").append(value);
            return this;
        }

        public SelectBuilder eq(String column, int value) {
            url.append("&").append(column).append("=eq.").append(value);
            return this;
        }

        public SelectBuilder gt(String column, int value) {
            url.append("&").append(column).append("=gt.").append(value);
            return this;
        }

        public SelectBuilder lt(String column, int value) {
            url.append("&").append(column).append("=lt.").append(value);
            return this;
        }

        public SelectBuilder gte(String column, int value) {
            url.append("&").append(column).append("=gte.").append(value);
            return this;
        }

        public SelectBuilder lte(String column, int value) {
            url.append("&").append(column).append("=lte.").append(value);
            return this;
        }

        public String getUrl() {
            return url.toString();
        }
    }

    public class RpcBuilder {
        public String getUrl() {
            return url.toString();
        }
    }


}
