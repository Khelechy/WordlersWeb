using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RestSharp;
using Wordlerweb.Models;

namespace Wordlerweb.Services
{
    public interface IApiServices
    {

    }
    public class ApiServices : IApiServices
    {
        private readonly IOptions<AppConfig> configuration;
        private string _baseUrl;
        public ApiServices(IOptions<AppConfig> configuration)
        {
            this.configuration = configuration;
            _baseUrl = configuration.Value.BaseUrl;
        }

        public async Task Login(string email, string password)
        {
            var client = new RestClient(_baseUrl);
            var url = "api/auth/login";
            var requestBody = new Dictionary<string, string>
            {
                ["Email"] = email,
                ["Password"] = password
            };
            var restRequest = new RestRequest(url) { Method = Method.Post };
            var jsonRequestBody = JsonConvert.SerializeObject(requestBody);
            restRequest.AddStringBody(jsonRequestBody, DataFormat.Json);
            var restResponse = await client.ExecuteAsync<dynamic>(restRequest);

        }
    }
}
